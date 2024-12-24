import { Author } from './author';
import { Tag } from './tag';

export type Article = {
  _id: string;
  title: string;
  slug: string;
  contents2: string;
  author: Author;
  tags: Tag[];
  _sys: { createdAt: string; updatedAt: string };
};
