import { Author } from './author';

export type Article = {
  _id: string;
  title: string;
  slug: string;
  contents2: string;
  author: Author;
  _sys: { createdAt: string; updatedAt: string };
};
