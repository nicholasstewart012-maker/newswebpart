import * as React from 'react';
import styles from './RenasantNews.module.scss';

export interface ICategoryBadgeProps {
    label: string;
    color: string;
}

export const CategoryBadge: React.FC<ICategoryBadgeProps> = ({ label, color }) => {
    // Check if color is the sky blue light color requiring dark text for contrast
    const isLight = color.toLowerCase() === '#96d4e8';
    const textColor = isLight ? 'var(--rnst-indigo)' : 'var(--rnst-white)';

    return (
        <div
            className={styles.categoryBadge}
            style={{ backgroundColor: color, color: textColor }}
        >
            {label}
        </div>
    );
};
