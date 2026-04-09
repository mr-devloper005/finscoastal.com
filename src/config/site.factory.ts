import type { SiteFactoryRecipe } from '@/design/factory/types'

export const SITE_FACTORY_RECIPE: SiteFactoryRecipe = {
  brandPack: 'market-utility',
  navbar: 'utility-bar',
  footer: 'minimal-footer',
  homeLayout: 'classified-home',
  motionPack: 'utility-snappy',
  primaryTask: 'classified',
  enabledTasks: ['classified'],
  taskLayouts: {
    classified: 'classified-market',
  },
}
