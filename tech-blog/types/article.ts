import { Image } from 'newt-client-js';
import { Author } from './author';
import { Tag } from './tag';

export type Article = {
  _id: string;
  title: string;
  slug: string;
  contents2: string;
  author: Author;
  tags: Tag[];
  coverImage: Image;
  _sys: { createdAt: string; updatedAt: string };
};
