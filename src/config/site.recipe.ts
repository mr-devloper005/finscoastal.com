import type { SiteRecipe } from '@/design/factory/recipe-types'

export const SITE_RECIPE: SiteRecipe = {
  productFamily: 'directory',
  themePack: 'directory-premium',
  homepageTemplate: 'classified-home',
  navbarTemplate: 'utility-bar',
  footerTemplate: 'minimal-footer',
  motionPack: 'utility-snappy',
  primaryTask: 'classified',
  enabledTasks: ['classified'],
  taskTemplates: {
    listing: 'listing-showcase',
    profile: 'profile-business',
    classified: 'classified-market',
  },
  manualOverrides: {
    navbar: false,
    footer: false,
    homePage: false,
    taskListPage: false,
    taskDetailPage: false,
    taskCard: false,
    contactPage: false,
    loginPage: false,
    registerPage: false,
  },
}
