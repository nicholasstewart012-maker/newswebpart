import * as React from 'react';
import styles from './RenasantNews.module.scss';
import { INewsItem } from '../models/INewsItem';
import { CategoryBadge } from './CategoryBadge';
import { CategoryColorBanner } from './CategoryColorBanner';
import { Icon } from '@fluentui/react/lib/Icon';

export interface IArticleCardProps {
    item: INewsItem;
    showExcerpt: boolean;
    showPublishedDate: boolean;
    showViewCount: boolean;
    isFeatured?: boolean;
}

export const NewsItemCard: React.FC<IArticleCardProps> = (props) => {
    const { item, showExcerpt, showPublishedDate, showViewCount, isFeatured } = props;

    const cardClass = isFeatured ? styles.featuredArticleCard : styles.newsItemCard;

    return (
        <a href={item.url} className={cardClass} aria-label={item.title}>
            <div className={styles.thumbnailContainer}>
                {item.bannerImageUrl ? (
                    <img src={item.bannerImageUrl} alt={item.title} className={styles.thumbnailImg} />
                ) : (
                    <CategoryColorBanner label={item.category} color={item.categoryColor} />
                )}
                <div className={styles.badgeOverlay}>
                    <CategoryBadge label={item.category} color={item.categoryColor} />
                </div>
            </div>
            <div className={styles.cardContent}>
                <h3 className={styles.articleTitle}>{item.title}</h3>
                {showExcerpt && item.description && (
                    <p className={styles.articleExcerpt}>{item.description}</p>
                )}
                <div className={styles.articleMeta}>
                    {showPublishedDate && (
                        <span className={styles.metaData}>{item.relativeDate}</span>
                    )}
                    {showViewCount && (
                        <span className={styles.metaData}>
                            <Icon iconName="ActivityFeed" className={styles.metaIcon} />
                            {item.viewCount}
                        </span>
                    )}
                </div>
            </div>
        </a>
    );
};
