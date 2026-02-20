import * as React from 'react';
import styles from './RenasantNews.module.scss';
import { Icon } from '@fluentui/react/lib/Icon';

export interface IWebpartHeaderProps {
    title: string;
    showTitle: boolean;
    showSeeAll: boolean;
    seeAllUrl: string;
    headerImageUrl: string;
    useOneTeamBanner: boolean;
}

export const WebpartHeader: React.FC<IWebpartHeaderProps> = (props) => {
    const { title, showTitle, showSeeAll, seeAllUrl, headerImageUrl, useOneTeamBanner } = props;

    let bannerSrc = headerImageUrl;
    if (!bannerSrc && useOneTeamBanner) {
        bannerSrc = require('../assets/One Team_Logo_Banner for Homepage_Indigo-01-01.jpg');
    }

    return (
        <div className={styles.webpartHeader}>
            {bannerSrc && (
                <img src={bannerSrc} alt="News Banner" className={styles.headerBanner} />
            )}
            <div className={styles.headerContent}>
                {showTitle && <h2 className={styles.sectionTitle}>{title}</h2>}
                {showSeeAll && seeAllUrl && (
                    <a href={seeAllUrl} className={styles.seeAllLink}>
                        See all <Icon iconName="ChevronRight" />
                    </a>
                )}
            </div>
        </div>
    );
};
