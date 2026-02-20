import { useState, useEffect } from 'react';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { INewsItem } from '../models/INewsItem';
import { IWebpartProps } from '../models/IWebpartProps';
import { CATEGORY_COLOR_MAP, FALLBACK_COLOR } from '../constants/categoryColorMap';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IUseNewsItemsProps extends IWebpartProps {
    context: WebPartContext;
}

export const useNewsItems = (props: IUseNewsItemsProps) => {
    const [items, setItems] = useState<INewsItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchNews = async () => {
            setLoading(true);
            setError(null);

            try {
                const siteUrl = props.newsSourceSiteUrl || props.context.pageContext.web.absoluteUrl;
                let queryUrl = `${siteUrl}/_api/web/lists/getbytitle('Site Pages')/items?$select=Id,Title,Description,PromotedState,FirstPublishedDate,Modified,Author/Title,BannerImageUrl,OData__OriginalSourceUrl,CheckoutUserId&$expand=Author`;

                // We can't always filter by PromotedState elegantly with OData if it's not indexed, but we can fetch them.
                // Actually, site pages usually have typical filtering available. For scheduling, we usually filter client-side 
                // because of nulls and complex date logic, or simple OData. We'll do client-side filtering after a generous max limit for safety.
                queryUrl += `&$top=100`;

                const response: SPHttpClientResponse = await props.context.spHttpClient.get(
                    queryUrl,
                    SPHttpClient.configurations.v1
                );

                if (!response.ok) {
                    throw new Error('Error fetching news items');
                }

                const data = await response.json();
                const now = new Date();

                const formattedItems: INewsItem[] = data.value
                    .map((item: any): INewsItem => {
                        // Mocking some fields since standard Site Pages might have different custom column names in the real tenant.
                        // Using logic conforming to the prompt requirement.
                        const published = new Date(item.FirstPublishedDate || item.Modified || now);
                        const scheduledStart = item[props.scheduledStartField] ? new Date(item[props.scheduledStartField]) : undefined;
                        const scheduledEnd = item[props.scheduledEndField] ? new Date(item[props.scheduledEndField]) : undefined;

                        // Default fallback logic for mapping category (e.g., from a custom "Category" field)
                        // If the field doesn't exist out of the box, we fallback to 'Company Initiative'
                        const cat = item.Category || 'Company Initiative';
                        const catColor = CATEGORY_COLOR_MAP[cat] || FALLBACK_COLOR;

                        // Extract URL from BannerImageUrl field
                        const bannerUrl = item.BannerImageUrl ? item.BannerImageUrl.Url : undefined;

                        return {
                            id: item.Id,
                            title: item.Title || 'Untitled News',
                            url: item.OData__OriginalSourceUrl || `${siteUrl}/SitePages/${item.Id}.aspx`,
                            description: item.Description || '',
                            category: cat,
                            categoryColor: props.categoryColorMode === 'manual' ? props.accentColor : catColor,
                            bannerImageUrl: bannerUrl,
                            authorDisplayName: item.Author ? item.Author.Title : 'System',
                            publishedDate: published,
                            relativeDate: getRelativeDate(published),
                            viewCount: item.ViewsLifeTime || 0, // Fallback if API doesn't return view count naturally here
                            scheduledStart,
                            scheduledEnd,
                            isPromoted: item.PromotedState === 2
                        };
                    })
                    .filter((item: INewsItem) => {
                        // Promoted State Filter
                        if (props.promotedStateFilter === 'promoted' && !item.isPromoted) return false;
                        if (props.promotedStateFilter === 'draft' && item.isPromoted) return false;

                        // Category Filter
                        if (props.filterByCategory && props.filterByCategory.length > 0) {
                            if (props.filterByCategory.indexOf(item.category) === -1) return false;
                        }

                        // Scheduling filter
                        if (props.enableScheduling) {
                            if (item.scheduledStart && item.scheduledStart > now) return false;
                            if (props.hideExpiredItems && item.scheduledEnd && item.scheduledEnd < now) return false;
                        }

                        return true;
                    })
                    // Sort by latest dates
                    .sort((a: INewsItem, b: INewsItem) => b.publishedDate.getTime() - a.publishedDate.getTime())
                    .slice(0, props.maxItems);

                if (isMounted) {
                    setItems(formattedItems);
                }

            } catch (err: any) {
                if (isMounted) setError(err.message || 'Unknown error');
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchNews().catch(console.error);

        return () => { isMounted = false; };
    }, [props]);

    return { items, loading, error };
};

function getRelativeDate(date: Date): string {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 14) return `${diffDays} days ago`;
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}
