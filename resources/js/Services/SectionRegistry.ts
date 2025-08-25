import { lazy } from 'react';

const SECTION_REGISTRY = {
  hero_banner: lazy(() => import('@/Components/App/Banner')),
  brands: lazy(() => import('@/Components/App/Brands')),
  seasonal: lazy(() => import('@/Components/App/SeasonalMustHaves')),
  new_arrivals: lazy(() => import('@/Components/App/ProductsGrid')),
  top_vendors: lazy(() => import('@/Components/App/TopVendors')),
  featured_categories: lazy(() => import('@/Components/App/FeaturedCategories')),
  customers_review: lazy(() => import('@/Components/App/ReviewCarousel')),
  newsletter: lazy(() => import('@/Components/App/NewsLetter')),
} as const;

export type SectionKey = keyof typeof SECTION_REGISTRY;

export const getSectionComponent = (sectionKey: SectionKey) => {
  return SECTION_REGISTRY[sectionKey];
};

export const getSectionComponentSafe = (sectionKey: string) => {
  if (sectionKey in SECTION_REGISTRY) {
    return SECTION_REGISTRY[sectionKey as SectionKey];
  }
  return null;
};
