interface SectionContent {
  is_active?: boolean;
  sort_order?: number;
  [key: string]: unknown;
}

interface PageContent {
  [sectionKey: string]: SectionContent;
}

interface PageRendererProps {
  pageSlug: string;
  initialPageContent?: PageContent;
  additionalProps?: Record<string, Record<string, unknown>>;
  fallbackComponent?: React.ComponentType;
}
