import homeContent from '../../../content/home.json'
import aboutContent from '../../../content/about.json'
import reportsContent from '../../../content/reports.json'
import pillarFiles from '../../../content/_pillars/all.json'
import pillarCJ from '../../../content/_pillars/climate-justice.json'
import pillarEF from '../../../content/_pillars/economic-fairness.json'
import pillarFN from '../../../content/_pillars/first-nations-justice.json'
import pillarHR from '../../../content/_pillars/human-rights.json'
import pillarMD from '../../../content/_pillars/media-democracy.json'

export {homeContent, aboutContent, reportsContent}

export const pillars = [pillarFiles, pillarCJ, pillarEF, pillarFN, pillarHR, pillarMD] as const

export const navLinks = [
  {path: '/campaigns', label: 'Campaigns', target: undefined},
  {path: '/about', label: 'About', target: undefined},
  {path: '/reports', label: 'Reports', target: undefined}
] as const

const campaignModules = import.meta.glob('../../../content/_campaigns/*.json', {eager: true}) as Record<
  string,
  any
>
export const campaigns = Object.values(campaignModules)
  .map((mod: any) => mod?.default ?? mod)
  .map((campaign: any) => ({
    ...campaign,
    title: campaign.title || campaign.heading || 'Untitled campaign',
    href: campaign.href || campaign.link || campaign.path || '#',
  }))
  // Keep featured near the top, then alphabetise for predictability
  .sort((a, b) => {
    if (!!a.featured === !!b.featured) return a.title.localeCompare(b.title)
    return a.featured ? -1 : 1
  })
