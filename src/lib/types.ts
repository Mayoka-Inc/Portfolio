import { z } from 'zod';

export const BlogPostSchema = z.object({
  content: z.string(),
  title: z.string(),
  translation: z.string().optional(),
  publishedAt: z.string(),
  summary: z.string(),
  language: z.string(),
  tags: z.array(z.string()),
  slug: z.string(),
  readingTime: z.number(),
});

export type BlogPost = z.infer<typeof BlogPostSchema>;

export interface NowPlayingSong {
  album: string;
  albumImageUrl: string;
  artist: string;
  isPlaying: boolean;
  songUrl: string;
  title: string;
}

export interface Stats {
  stars: number;
  totalCommits: number;
  totalRepos: number;
  followers: number;
  contributions: number;
  prs: number;
  issues: number;
  topLanguages: {
    name: string;
    count: number;
    color: string;
  }[];
}

export interface Projects {
  name: string;
  url: string;
  homepage: string;
  description: string;
  stargazerCount: number;
  language: {
    name: string;
    color: string;
  };
}

export enum Form {
  Initial,
  Loading,
  Success,
  Error,
}

export interface FormState {
  state: Form;
  message?: string;
}

export interface Song {
  songUrl: string;
  artist: string;
  cover: string;
  title: string;
}

export interface TopTracks {
  tracks: Song[];
}

export interface ResponseTrackType {
  artists: {
    name: string;
  }[];
  name: string;
  external_urls: {
    spotify: string;
  };
  album: {
    images: {
      url: string;
    }[];
  };
}

