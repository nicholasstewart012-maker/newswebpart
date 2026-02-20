import { IWebpartProps } from '../models/IWebpartProps';

export const defaultConfig: IWebpartProps = {
    title: 'Company News',
    showTitle: true,
    showSeeAll: true,
    seeAllUrl: '',
    maxItems: 6,
    layout: 'list',
    showViewCount: true,
    showPublishedDate: true,
    showExcerpt: true,
    headerImageUrl: '',
    useOneTeamBanner: false,
    accentColor: '#0E2D6D',
    categoryColorMode: 'auto',
    newsSourceSiteUrl: '',
    filterByCategory: [],
    promotedStateFilter: 'promoted',
    enableScheduling: false,
    scheduledStartField: 'PublishStartDate',
    scheduledEndField: 'PublishEndDate',
    hideExpiredItems: true,
};
