import * as React from 'react';
import styles from './RenasantNews.module.scss';
import { ICategoryBadgeProps } from './CategoryBadge';

export const CategoryColorBanner: React.FC<ICategoryBadgeProps> = ({ label, color }) => {
    const isLight = color.toLowerCase() === '#96d4e8';
    const textColor = isLight ? 'var(--rnst-indigo)' : 'var(--rnst-white)';

    return (
        <div
            className={styles.categoryColorBanner}
            style={{ backgroundColor: color, color: textColor }}
        >
            <span className={styles.bannerText}>{label}</span>
        </div>
    );
};
