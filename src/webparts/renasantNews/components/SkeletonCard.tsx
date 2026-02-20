import * as React from 'react';
import styles from './RenasantNews.module.scss';
import { Shimmer, ShimmerElementType } from '@fluentui/react';

export const SkeletonCard: React.FC = () => {
    return (
        <div className={styles.skeletonCard}>
            <Shimmer
                shimmerElements={[
                    { type: ShimmerElementType.line, height: 160, width: '100%' }
                ]}
            />
            <div className={styles.skeletonBody}>
                <Shimmer shimmerElements={[{ type: ShimmerElementType.line, height: 16, width: '30%' }]} className={styles.skeletonPill} />
                <Shimmer shimmerElements={[{ type: ShimmerElementType.line, height: 24, width: '80%' }]} className={styles.skeletonPill} />
                <Shimmer shimmerElements={[{ type: ShimmerElementType.line, height: 24, width: '60%' }]} className={styles.skeletonPill} />
                <Shimmer shimmerElements={[{ type: ShimmerElementType.line, height: 12, width: '100%' }]} className={styles.skeletonPill} />
                <Shimmer shimmerElements={[{ type: ShimmerElementType.line, height: 12, width: '90%' }]} className={styles.skeletonPill} />
            </div>
        </div>
    );
};
