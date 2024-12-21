import { Image } from 'newt-client-js';

export type Author = {
  _id: string;
  fullName: string;
  slug: string;
  biography: string;
  profileImage: Image;
};
