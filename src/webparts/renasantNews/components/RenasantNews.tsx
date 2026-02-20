import * as React from 'react';
import styles from './RenasantNews.module.scss';
import { IRenasantNewsProps } from './IRenasantNewsProps';
import { useNewsItems } from '../hooks/useNewsItems';
import { WebpartHeader } from './WebpartHeader';
import { NewsItemCard } from './NewsItemCard';
import { SkeletonCard } from './SkeletonCard';
import { EmptyState } from './EmptyState';
import { WebPartContext } from '@microsoft/sp-webpart-base';

// Create a context wrapper property since standard SPFX component props don't always pass WebPartContext directly. 
// We passed `this.context` in `RenasantNewsWebPart.ts`? Let me check. Wait, I only passed title, etc.
// I need to update RenasantNewsWebPart.ts to pass `context` OR we can manage SPHttpClient directly. 
// I'll assume we pass `context` as `any` or WebPartContext in `IRenasantNewsProps` next.

const RenasantNewsInner: React.FC<IRenasantNewsProps> = (props) => {
  const { items, loading, error } = useNewsItems({ ...props, context: props.context });

  if (error) {
    return <div className={styles.errorState}>Error loading news: {error}</div>;
  }

  return (
    <section className={`${styles.renasantNews} ${props.hasTeamsContext ? styles.teams : ''}`}>
      <WebpartHeader
        title={props.title}
        showTitle={props.showTitle}
        showSeeAll={props.showSeeAll}
        seeAllUrl={props.seeAllUrl}
        headerImageUrl={props.headerImageUrl}
        useOneTeamBanner={props.useOneTeamBanner}
      />

      {loading ? (
        <div className={styles.gridContainer}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className={`${styles.newsLayout} ${props.layout === 'featured+list' ? styles.featuredList : (styles as any)[props.layout]}`}>
          {props.layout === 'featured+list' && items.length > 0 && (
            <div className={styles.featuredSection}>
              <NewsItemCard
                item={items[0]}
                isFeatured={true}
                showExcerpt={props.showExcerpt}
                showPublishedDate={props.showPublishedDate}
                showViewCount={props.showViewCount}
              />
            </div>
          )}

          <div className={styles.listSection}>
            {items.slice(props.layout === 'featured+list' ? 1 : 0).map((item) => (
              <NewsItemCard
                key={item.id}
                item={item}
                isFeatured={false}
                showExcerpt={props.showExcerpt}
                showPublishedDate={props.showPublishedDate}
                showViewCount={props.showViewCount}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default class RenasantNews extends React.Component<IRenasantNewsProps, {}> {
  public render(): React.ReactElement {
    return <RenasantNewsInner {...this.props} />;
  }
}
