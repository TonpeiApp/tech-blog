import 'server-only';
import { createClient, Image } from 'newt-client-js';
import { cache } from 'react';
import type { Article } from '@/types/article';
import { Author } from '@/types/author';
import { Tag } from '@/types/tag';

export const client = createClient({
  spaceUid: process.env.NEWT_SPACE_UID + '',
  token: process.env.NEWT_CDN_API_TOKEN + '',
  apiType: 'cdn',
});

export const searchArticles = cache(async (keyword: string, page: number, pageSize: number) => {
  const { items, total } = await client.getContents<Article>({
    appUid: 'blog',
    modelUid: 'article',
    query: {
      depth: 2,
      title: {
        match: keyword,
      },
      select: [
        '_id',
        'title',
        'slug',
        'contents2',
        'author',
        'tags',
        'coverImage',
        '_sys.createdAt',
        '_sys.updatedAt',
      ],
      body: {
        fmt: 'text',
      },
      limit: pageSize,
      skip: (page - 1) * pageSize,
    },
  });
  return { items, total };
});

export const getArticles = cache(async (page: number, pageSize: number) => {
  const { items, total } = await client.getContents<Article>({
    appUid: 'blog',
    modelUid: 'article',
    query: {
      depth: 2,
      select: [
        '_id',
        'title',
        'slug',
        'contents2',
        'author',
        'tags',
        'coverImage',
        '_sys.createdAt',
        '_sys.updatedAt',
      ],
      body: {
        fmt: 'text',
      },
      limit: pageSize,
      skip: (page - 1) * pageSize,
    },
  });
  return { items, total };
});

export const getArticleBySlug = cache(async (slug: string) => {
  const article = await client.getFirstContent<Article>({
    appUid: 'blog',
    modelUid: 'article',
    query: {
      depth: 2,
      slug,
      select: [
        '_id',
        'title',
        'slug',
        'contents2',
        'author',
        'tags',
        'coverImage',
        '_sys.createdAt',
        '_sys.updatedAt',
      ],
    },
  });
  return article;
});

export const getAuthors = cache(async () => {
  const { items } = await client.getContents<Author>({
    appUid: 'blog',
    modelUid: 'author',
    query: {
      select: ['_id', 'fullName', 'slug', 'biography', 'profileImage'],
      body: {
        fmt: 'text',
      },
    },
  });
  return items;
});

export const getAuthorBySlug = cache(async (slug: string) => {
  const author = await client.getFirstContent<Author>({
    appUid: 'blog',
    modelUid: 'author',
    query: {
      slug,
      select: ['_id', 'fullName', 'slug', 'biography', 'profileImage'],
    },
  });
  return author;
});

export const getTags = cache(async () => {
  const { items } = await client.getContents<Tag>({
    appUid: 'blog',
    modelUid: 'tag',
    query: {
      select: ['_id', 'name', 'slug'],
      body: {
        fmt: 'text',
      },
    },
  });
  return items;
});

export const getTagBySlug = cache(async (slug: string) => {
  const tags = await client.getFirstContent<Tag>({
    appUid: 'blog',
    modelUid: 'tag',
    query: {
      slug,
      select: ['_id', 'name', 'slug'],
    },
  });
  return tags;
});

export const getImage = cache(async () => {
  const { items } = await client.getContents<Image>({
    appUid: 'blog',
    modelUid: 'author',
    query: {
      body: {
        fmt: 'text',
      },
    },
  });
  return items;
});

// 全記事を取得する関数を追加
export const getAllArticles = cache(async () => {
  const { items } = await client.getContents<Article>({
    appUid: 'blog',
    modelUid: 'article',
    query: {
      depth: 2,
      select: [
        '_id',
        'title',
        'slug',
        'contents2',
        'author',
        'tags',
        'coverImage',
        '_sys.createdAt',
        '_sys.updatedAt',
      ],
    },
  });
  return items;
});

// タグIDに基づいて関連記事を取得する関数を追加
export const getRelatedArticlesByTags = cache(
  async (tagIds: string[], currentArticleId: string, limit: number = 5) => {
    const { items } = await client.getContents<Article>({
      appUid: 'blog',
      modelUid: 'article',
      query: {
        depth: 2,
        select: [
          '_id',
          'title',
          'slug',
          'contents2',
          'author',
          'tags',
          'coverImage',
          '_sys.createdAt',
          '_sys.updatedAt',
        ],
        tags: {
          in: tagIds,
        },
        _id: {
          ne: currentArticleId, // 現在の記事を除外
        },
        limit,
      },
    });
    return items;
  }
);
