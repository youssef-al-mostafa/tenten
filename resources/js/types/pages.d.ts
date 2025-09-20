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

interface HelpPageData {
    hero_section?: {
        title?: string;
        subtitle?: string;
    };
    vendor_verification?: {
        title?: string;
        description?: string;
        steps?: Array<{
            step_number: number;
            title: string;
            description: string;
            icon_color: string;
        }>;
        requirements_title?: string;
        processing_time?: string;
        approval_rate?: string;
        documents?: Array<{
            name: string;
        }>;
    };
    commission_structure?: {
        title?: string;
        fees?: Array<{
            name: string;
            percentage: string;
            description: string;
            icon_color: string;
        }>;
        payout_info?: string;
    };
    product_approval?: {
        title?: string;
        approval_process_title?: string;
        approval_process_steps?: Array<{
            step_number: number;
            title: string;
            description: string;
        }>;
        quality_standards_title?: string;
        approved_items?: Array<{
            item: string;
        }>;
        prohibited_items?: Array<{
            item: string;
        }>;
        quality_approval_rate?: string;
    };
    cta_section?: {
        title?: string;
        description?: string;
        button_text?: string;
        button_link?: string;
    };
}
