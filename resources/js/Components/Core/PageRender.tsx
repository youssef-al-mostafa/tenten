import { Suspense, useEffect, useState, useMemo } from 'react';
import { getSectionComponent, getSectionComponentSafe } from '@/Services/SectionRegistry';

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

export function PageRenderer({
  pageSlug,
  initialPageContent,
  additionalProps = {},
  fallbackComponent: FallbackComponent
}: PageRendererProps) {
  const [pageContent, setPageContent] = useState(initialPageContent);
  const [loading, setLoading] = useState(!initialPageContent);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialPageContent && pageSlug) {
      fetchPageContent(pageSlug);
    }
  }, [pageSlug, initialPageContent]);

  const fetchPageContent = async (slug: string) => {
    try {
      setLoading(true);

      const response = await fetch(`/api/pages/${slug}/content`);

      if (!response.ok) {
        throw new Error(`Failed to fetch page content for ${slug}`);
      }

      const data = await response.json();
      setPageContent(data.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('PageRenderer fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const sortedSections = useMemo(() => {
    if (!pageContent) return [];

    return Object.entries(pageContent)
      .filter(([_, sectionData]) => sectionData?.is_active !== false)
      .sort(([_, a], [__, b]) => (a.sort_order || 0) - (b.sort_order || 0))
      .map(([sectionKey, sectionData]) => ({
        key: sectionKey,
        data: sectionData,
        Component: getSectionComponentSafe(sectionKey)
      }))
      .filter(({ Component }) => Component !== null);
  }, [pageContent]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading page content...</span>
      </div>
    );
  }

  if (error) {
    return FallbackComponent ? (
      <FallbackComponent />
    ) : (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading page content: {error}</p>
        <button
          onClick={() => fetchPageContent(pageSlug)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {sortedSections.map(({ key, data, Component }) => {
        if (!Component) return null;
        
        return (
          <Suspense
            key={key}
            fallback={
              <div className="animate-pulse bg-gray-200 h-32 w-full rounded"></div>
            }
          >
            <Component
              content={data}
              {...(additionalProps[key] || {})}
            />
          </Suspense>
        );
      })}
    </>
  );
}