export interface AnimePosterImage {
  tiny?: string;
  small?: string;
  medium?: string;
  large?: string;
  original?: string;
}

export interface AnimeTitles {
  en?: string;
  en_jp?: string;
  ja_jp?: string;
}

export interface AnimeAttributes {
  slug: string;
  canonicalTitle: string;
  titles?: AnimeTitles;
  posterImage?: AnimePosterImage;
  synopsis?: string;
}

export interface AnimeItem {
  id: string;
  type: string;
  links?: {
    self: string;
  };
  attributes: AnimeAttributes;
}

export interface AnimeResponse {
  data: AnimeItem[];
  meta?: {
    count: number;
  };
}
