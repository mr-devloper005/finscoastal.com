import { defineSiteTheme } from '@/config/site.theme.defaults'

export const SITE_THEME = defineSiteTheme({
  shell: 'market',
  hero: {
    variant: 'catalog-promo',
    eyebrow: 'Premium multi-surface publishing system',
  },
  home: {
    layout: 'market-catalog',
    primaryTask: 'classified',
    featuredTaskKeys: ['classified', 'listing', 'profile'],
  },
  navigation: {
    variant: 'minimal',
  },
  footer: {
    variant: 'minimal',
  },
  cards: {
    listing: 'catalog-grid',
    article: 'editorial-feature',
    image: 'studio-panel',
    profile: 'catalog-grid',
    classified: 'catalog-grid',
    pdf: 'catalog-grid',
    sbm: 'editorial-feature',
    social: 'studio-panel',
    org: 'catalog-grid',
    comment: 'editorial-feature',
  },
})
