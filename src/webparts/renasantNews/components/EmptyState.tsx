import * as React from 'react';
import styles from './RenasantNews.module.scss';
import { Icon } from '@fluentui/react/lib/Icon';

export const EmptyState: React.FC = () => {
    return (
        <div className={styles.emptyStateContainer}>
            <Icon iconName="NewsSearch" className={styles.emptyStateIcon} />
            <div className={styles.emptyStateMessage}>No news items to display at this time.</div>
        </div>
    );
};
