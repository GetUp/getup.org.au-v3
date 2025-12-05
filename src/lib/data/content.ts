

import homePageData from '../../../content/pages/home.json'
import heroSettings from '../../../content/settings/hero.json'
import campaignSettings from '../../../content/settings/campaigns.json'
import aboutPageData from '../../../content/pages/about.json'
import aboutBoard from '../../../content/pages/about/board.json'
import aboutFaqs from '../../../content/pages/about/faqs.json'
import aboutWork from '../../../content/pages/about/work-at-getup.json'
import aboutTransparency from '../../../content/pages/about/transparency.json'
import reportsContent from '../../../content/pages/about/reports.json'
import researchReportsContent from '../../../content/pages/research-reports.json'
import donateMain from '../../../content/donate/donate.json'
import donateCrew from '../../../content/donate/crew.json'
import donateWillpower from '../../../content/donate/willpower.json'
import pillarsData from '../../../content/pillars.json'
import headerData from '../../../content/shared/header.json'
import footerData from '../../../content/footer.json'

export const homeContent = {
  header: {
    title: homePageData.hero.heading,
    description: homePageData.hero.subhead,
    image: homePageData.hero.images?.[0] || "/images/women-htv-og-tote.png"
  },
  hero: {
    heading: homePageData.hero.heading,
    subhead: homePageData.hero.subhead,
    images: homePageData.hero.images?.length ? homePageData.hero.images : ["/images/women-htv-og-tote.png"],

    // Config from settings
    stickyLatest: heroSettings.stickyLatest,
    ctaType: heroSettings.ctaType,
    primaryButton: heroSettings.primaryButton,
    secondaryButton: heroSettings.secondaryButton,
    signupForm: heroSettings.signupForm || {
      desktopFields: ["firstName", "lastName", "postcode"],
      mobileFields: ["postcode"],
      requiredFields: ["postcode"]
    },

    // Compatibility mapping
    button: heroSettings.primaryButton?.label,
    description: homePageData.hero.subhead,
  },
  takeActionNow: homePageData.takeAction,
  whatIsGetUp: {
    ...homePageData.impact,
    // Pass body as is (markdown string) or legacy array
    body: homePageData.impact.body || "",
    ctas: (homePageData.impact as any).ctas || [],
    // Map new stats settings to structure expected by ImpactSection
    impactStats: {
      period: homePageData.impact.stats.period,
      heading: `Our Impact: Last ${homePageData.impact.stats.period} `,
      stats: [
        { label: homePageData.impact.stats.stat1, value: "..." },
        { label: homePageData.impact.stats.stat2, value: "..." },
        { label: homePageData.impact.stats.stat3, value: "..." }
      ]
    }
  },
  mission: {
    ...homePageData.members,
    testimonials: homePageData.members.quote ? [homePageData.members.quote] : [],
    ctas: homePageData.members.ctas || [],
  },
  getInvolved: (homePageData as any).getInvolved || {},
  values: homePageData.values,
  footer: (homePageData as any).footer || {},
}

export const aboutContent = {
  header: aboutPageData.header,
  sections: [
    aboutPageData.who,
    aboutPageData.what,
    aboutPageData.how,
    aboutPageData.donations,
  ].filter(Boolean),
}
export { aboutBoard, aboutFaqs, aboutWork, aboutTransparency, researchReportsContent }

export const donateContent = {
  header: donateMain,
  sections: [donateCrew, donateWillpower].filter(Boolean),
}

export { reportsContent }

export const pillars = pillarsData.pillars
export const navigationLinks = headerData.items
export const headerContent = headerData
export const footerContent = footerData

// Backwards compatibility
export const navLinks = headerData.items

const campaignModules = import.meta.glob('../../../content/_campaigns/*.json', { eager: true }) as Record<
  string,
  any
>
export const campaigns = Object.values(campaignModules)
  .map((mod: any) => mod?.default ?? mod)
  .map((campaign: any) => ({
    ...campaign,
    title: campaign.title || campaign.heading || 'Untitled campaign',
    href: campaign.href || campaign.link || campaign.path || '#',
    status: campaign.status || (campaign.featured ? 'featured' : 'none'),
  }))
  // Alphabetise for predictability
  .sort((a, b) => a.title.localeCompare(b.title))

export const takeActionLists = (() => {
  const live = campaigns.filter((c) => !c.archived);
  const top = live.filter((c) => c.status === 'top').slice(0, campaignSettings.topCount || 1);
  const featured = live.filter((c) => c.status === 'featured').slice(0, campaignSettings.featuredCount || 3);
  // cbmCount not explicitly used here but good to have in settings
  return { top, featured };
})();
