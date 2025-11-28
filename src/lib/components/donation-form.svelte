<script>
  // @ts-nocheck
  let { onClose = () => {} } = $props();
  
  // Form state
  let amount = $state(50);
  let customAmount = $state('');
  let frequency = $state('monthly');
  let paymentMethod = $state('card');
  let isProcessing = $state(false);
  let step = $state(1);
  let errorMessage = $state('');
  let successMessage = $state('');
  
  // Card form state
  let cardNumber = $state('');
  let cardExpiry = $state('');
  let cardCvc = $state('');
  let cardName = $state('');
  let email = $state('');
  
  // Wallet availability
  let applePayAvailable = $state(false);
  let googlePayAvailable = $state(false);
  
  const presetAmounts = [25, 50, 100, 250, 500];
  
  // Check wallet availability on mount
  $effect(() => {
    checkWalletAvailability();
  });
  
  async function checkWalletAvailability() {
    // Check Apple Pay availability using native browser API
    if (typeof window !== 'undefined' && window.ApplePaySession) {
      applePayAvailable = window.ApplePaySession.canMakePayments();
    }
    
    // Check Google Pay availability
    if (typeof window !== 'undefined' && window.google?.payments?.api) {
      try {
        const paymentsClient = new window.google.payments.api.PaymentsClient({
          environment: 'TEST'
        });
        const isReadyToPay = await paymentsClient.isReadyToPay({
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: [{
            type: 'CARD',
            parameters: {
              allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
              allowedCardNetworks: ['AMEX', 'MASTERCARD', 'VISA']
            }
          }]
        });
        googlePayAvailable = isReadyToPay.result;
      } catch (e) {
        googlePayAvailable = false;
      }
    }
  }
  
  function selectAmount(value) {
    amount = value;
    customAmount = '';
  }
  
  function handleCustomAmount(e) {
    const value = e.target.value.replace(/[^0-9]/g, '');
    customAmount = value;
    if (value) {
      amount = parseInt(value, 10);
    }
  }
  
  function formatCardNumber(e) {
    let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/g, '');
    value = value.match(/.{1,4}/g)?.join(' ') || value;
    cardNumber = value.substring(0, 19);
  }
  
  function formatExpiry(e) {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    cardExpiry = value;
  }
  
  function formatCvc(e) {
    cardCvc = e.target.value.replace(/[^0-9]/g, '').substring(0, 4);
  }
  
  function goToPayment() {
    if (amount >= 5) {
      step = 2;
      errorMessage = '';
    } else {
      errorMessage = 'Minimum donation is $5';
    }
  }
  
  function goBack() {
    step = 1;
    errorMessage = '';
  }
  
  // FatZebra API integration
  async function processCardPayment() {
    isProcessing = true;
    errorMessage = '';
    
    try {
      const amountInCents = amount * 100;
      
      const paymentData = {
        amount: amountInCents,
        currency: 'AUD',
        reference: `DON-${Date.now()}`,
        customer_ip: '0.0.0.0',
        card_holder: cardName,
        card_number: cardNumber.replace(/\s/g, ''),
        card_expiry: cardExpiry.replace('/', ''),
        cvv: cardCvc,
        ...(frequency !== 'once' && {
          extra: {
            ecm: '32',
            stored_credential_indicator: 'I'
          }
        })
      };
      
      const response = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...paymentData,
          email,
          frequency,
          isRecurring: frequency !== 'once'
        })
      });
      
      const result = await response.json();
      
      if (result.successful) {
        successMessage = `Thank you for your ${frequency === 'once' ? '' : frequency + ' '}donation of $${amount}!`;
      } else {
        errorMessage = result.message || 'Payment failed. Please try again.';
      }
    } catch (error) {
      errorMessage = 'An error occurred. Please try again.';
    } finally {
      isProcessing = false;
    }
  }
  
  async function processApplePay() {
    if (!window.ApplePaySession) {
      errorMessage = 'Apple Pay is not available';
      return;
    }
    
    isProcessing = true;
    errorMessage = '';
    
    try {
      const paymentRequest = {
        countryCode: 'AU',
        currencyCode: 'AUD',
        supportedNetworks: ['visa', 'masterCard', 'amex'],
        merchantCapabilities: ['supports3DS'],
        total: {
          label: 'GetUp Donation',
          amount: amount.toFixed(2),
          type: frequency !== 'once' ? 'recurring' : 'final'
        },
        ...(frequency !== 'once' && {
          recurringPaymentRequest: {
            paymentDescription: `${frequency === 'monthly' ? 'Monthly' : 'Yearly'} Donation`,
            regularBilling: {
              label: `${frequency === 'monthly' ? 'Monthly' : 'Yearly'} Donation`,
              amount: amount.toFixed(2),
              paymentTiming: 'recurring'
            },
            managementURL: 'https://getup.org.au/donations/manage'
          }
        })
      };
      
      const session = new window.ApplePaySession(10, paymentRequest);
      
      session.onvalidatemerchant = async (event) => {
        const response = await fetch('/api/apple-pay/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ validationURL: event.validationURL })
        });
        const merchantSession = await response.json();
        session.completeMerchantValidation(merchantSession);
      };
      
      session.onpaymentauthorized = async (event) => {
        const response = await fetch('/api/donate/apple-pay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentToken: event.payment.token,
            amount: amount * 100,
            frequency,
            email,
            isRecurring: frequency !== 'once',
            extra: frequency !== 'once' ? {
              ecm: '32',
              stored_credential_indicator: 'I'
            } : undefined
          })
        });
        
        const result = await response.json();
        
        if (result.successful) {
          session.completePayment(window.ApplePaySession.STATUS_SUCCESS);
          successMessage = `Thank you for your ${frequency === 'once' ? '' : frequency + ' '}donation of $${amount}!`;
        } else {
          session.completePayment(window.ApplePaySession.STATUS_FAILURE);
          errorMessage = result.message || 'Payment failed';
        }
      };
      
      session.oncancel = () => {
        isProcessing = false;
      };
      
      session.begin();
    } catch (error) {
      errorMessage = 'Apple Pay error. Please try another method.';
      isProcessing = false;
    }
  }
  
  async function processGooglePay() {
    if (!window.google?.payments?.api) {
      errorMessage = 'Google Pay is not available';
      return;
    }
    
    isProcessing = true;
    errorMessage = '';
    
    try {
      const paymentsClient = new window.google.payments.api.PaymentsClient({
        environment: 'TEST'
      });
      
      const paymentDataRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [{
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['AMEX', 'MASTERCARD', 'VISA']
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: 'fatzebra',
              gatewayMerchantId: 'YOUR_MERCHANT_ID'
            }
          }
        }],
        merchantInfo: {
          merchantId: 'YOUR_GOOGLE_MERCHANT_ID',
          merchantName: 'GetUp'
        },
        transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPrice: amount.toFixed(2),
          currencyCode: 'AUD',
          countryCode: 'AU'
        },
        emailRequired: true
      };
      
      const paymentData = await paymentsClient.loadPaymentData(paymentDataRequest);
      
      const response = await fetch('/api/donate/google-pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentData: paymentData.paymentMethodData,
          amount: amount * 100,
          frequency,
          email: paymentData.email || email,
          isRecurring: frequency !== 'once',
          extra: frequency !== 'once' ? {
            ecm: '32',
            stored_credential_indicator: 'I'
          } : undefined
        })
      });
      
      const result = await response.json();
      
      if (result.successful) {
        successMessage = `Thank you for your ${frequency === 'once' ? '' : frequency + ' '}donation of $${amount}!`;
      } else {
        errorMessage = result.message || 'Payment failed';
      }
    } catch (error) {
      if (error.statusCode !== 'CANCELED') {
        errorMessage = 'Google Pay error. Please try another method.';
      }
    } finally {
      isProcessing = false;
    }
  }
  
  function handleSubmit(e) {
    e.preventDefault();
    
    if (paymentMethod === 'apple') {
      processApplePay();
    } else if (paymentMethod === 'google') {
      processGooglePay();
    } else {
      processCardPayment();
    }
  }
</script>

<svelte:head>
  <script src="https://pay.google.com/gp/p/js/pay.js" async></script>
</svelte:head>

<div class="bg-white rounded-lg max-w-lg mx-auto">
  {#if successMessage}
    <div class="text-center py-12 px-6">
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 class="text-2xl font-extrabold text-slate-900 mb-2">Thank You!</h3>
      <p class="text-slate-600 mb-6">{successMessage}</p>
      {#if frequency !== 'once'}
        <p class="text-sm text-slate-500 mb-6">
          Your {frequency} donation has been set up. You can manage your recurring donations in your account.
        </p>
      {/if}
      <button 
        onclick={onClose}
        class="px-6 py-3 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 transition-colors"
      >
        Close
      </button>
    </div>
  {:else if step === 1}
    <div class="p-6">
      <h2 class="text-2xl font-extrabold text-slate-900 mb-2 text-center">Make a Donation</h2>
      <p class="text-slate-600 text-center mb-6">Support our campaigns for a fair, flourishing Australia.</p>
      
      <div class="flex rounded-lg bg-slate-100 p-1 mb-6">
        <button 
          onclick={() => frequency = 'once'}
          class="flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors {frequency === 'once' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'}"
        >
          One-time
        </button>
        <button 
          onclick={() => frequency = 'monthly'}
          class="flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors {frequency === 'monthly' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'}"
        >
          Monthly
        </button>
        <button 
          onclick={() => frequency = 'yearly'}
          class="flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors {frequency === 'yearly' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'}"
        >
          Yearly
        </button>
      </div>
      
      <div class="grid grid-cols-3 gap-3 mb-4">
        {#each presetAmounts as preset}
          <button
            onclick={() => selectAmount(preset)}
            class="py-3 px-4 rounded-lg border-2 font-bold text-lg transition-colors {amount === preset && !customAmount ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-200 text-slate-700 hover:border-slate-300'}"
          >
            ${preset}
          </button>
        {/each}
        
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
          <input
            type="text"
            placeholder="Other"
            value={customAmount}
            oninput={handleCustomAmount}
            class="w-full py-3 pl-8 pr-4 rounded-lg border-2 font-bold text-lg transition-colors {customAmount ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-200 text-slate-700'} focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>
      
      {#if frequency !== 'once'}
        <p class="text-sm text-slate-500 text-center mb-4">
          You'll be charged ${amount} {frequency === 'monthly' ? 'every month' : 'every year'}
        </p>
      {/if}
      
      {#if errorMessage}
        <p class="text-red-500 text-sm text-center mb-4">{errorMessage}</p>
      {/if}
      
      <button
        onclick={goToPayment}
        class="w-full py-4 bg-orange-500 text-white font-bold text-lg rounded-lg hover:bg-orange-600 transition-colors"
      >
        Continue to Payment
      </button>
    </div>
  {:else}
    <div class="p-6">
      <button 
        onclick={goBack}
        class="flex items-center text-slate-600 hover:text-slate-900 mb-4"
      >
        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
      
      <div class="text-center mb-6">
        <p class="text-slate-600">
          {frequency === 'once' ? 'One-time' : frequency === 'monthly' ? 'Monthly' : 'Yearly'} donation
        </p>
        <p class="text-3xl font-extrabold text-slate-900">${amount}</p>
      </div>
      
      {#if applePayAvailable || googlePayAvailable}
        <div class="space-y-3 mb-6">
          {#if applePayAvailable}
            <button
              onclick={() => { paymentMethod = 'apple'; processApplePay(); }}
              disabled={isProcessing}
              class="w-full py-3 bg-black text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Pay with Apple Pay
            </button>
          {/if}
          
          {#if googlePayAvailable}
            <button
              onclick={() => { paymentMethod = 'google'; processGooglePay(); }}
              disabled={isProcessing}
              class="w-full py-3 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Pay with Google Pay
            </button>
          {/if}
        </div>
        
        <div class="relative mb-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-slate-200"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="bg-white px-4 text-slate-500">Or pay with card</span>
          </div>
        </div>
      {/if}
      
      <form onsubmit={handleSubmit} class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-semibold text-slate-700 mb-1">Email</label>
          <input
            type="email"
            id="email"
            bind:value={email}
            required
            placeholder="your@email.com"
            class="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
          />
        </div>
        
        <div>
          <label for="cardName" class="block text-sm font-semibold text-slate-700 mb-1">Name on card</label>
          <input
            type="text"
            id="cardName"
            bind:value={cardName}
            required
            placeholder="Full name"
            class="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
          />
        </div>
        
        <div>
          <label for="cardNumber" class="block text-sm font-semibold text-slate-700 mb-1">Card number</label>
          <input
            type="text"
            id="cardNumber"
            value={cardNumber}
            oninput={formatCardNumber}
            required
            placeholder="1234 5678 9012 3456"
            maxlength="19"
            class="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
          />
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="expiry" class="block text-sm font-semibold text-slate-700 mb-1">Expiry</label>
            <input
              type="text"
              id="expiry"
              value={cardExpiry}
              oninput={formatExpiry}
              required
              placeholder="MM/YY"
              maxlength="5"
              class="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label for="cvc" class="block text-sm font-semibold text-slate-700 mb-1">CVC</label>
            <input
              type="text"
              id="cvc"
              value={cardCvc}
              oninput={formatCvc}
              required
              placeholder="123"
              maxlength="4"
              class="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>
        
        {#if errorMessage}
          <p class="text-red-500 text-sm">{errorMessage}</p>
        {/if}
        
        <button
          type="submit"
          disabled={isProcessing}
          class="w-full py-4 bg-orange-500 text-white font-bold text-lg rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {#if isProcessing}
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          {:else}
            Donate ${amount} {frequency !== 'once' ? frequency : ''}
          {/if}
        </button>
        
        <p class="text-xs text-slate-500 text-center">
          {#if frequency !== 'once'}
            By donating, you agree to our recurring donation terms. You can cancel anytime.
          {:else}
            Your donation is secure and encrypted.
          {/if}
        </p>
      </form>
    </div>
  {/if}
</div>
<!-- @ts-nocheck -->
