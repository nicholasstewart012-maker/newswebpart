export interface IWebpartProps {
    // Display
    title: string;
    showTitle: boolean;
    showSeeAll: boolean;
    seeAllUrl: string;
    maxItems: number;
    layout: 'list' | 'cards' | 'featured+list';
    showViewCount: boolean;
    showPublishedDate: boolean;
    showExcerpt: boolean;

    // Branding
    headerImageUrl: string;
    useOneTeamBanner: boolean;
    accentColor: string;
    categoryColorMode: 'auto' | 'manual';

    // Content Source
    newsSourceSiteUrl: string;
    filterByCategory: string[];
    promotedStateFilter: 'all' | 'promoted' | 'draft';

    // Scheduling
    enableScheduling: boolean;
    scheduledStartField: string;
    scheduledEndField: string;
    hideExpiredItems: boolean;
}
