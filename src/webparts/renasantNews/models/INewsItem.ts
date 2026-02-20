export interface INewsItem {
  id: number;
  title: string;
  url: string;
  description: string;
  category: string;
  categoryColor: string;
  bannerImageUrl?: string;
  authorDisplayName: string;
  publishedDate: Date;
  relativeDate: string;
  viewCount?: number;
  scheduledStart?: Date;
  scheduledEnd?: Date;
  isPromoted: boolean;
}
