import { Cloudinary } from './cloudinary.model';
export interface Sponsor {
  //Auto Generated By Cloud Function
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;

  //Core Fields
  company: string;
  slug: string;
  coverPhoto?: Cloudinary;
  description?: string;
  url?: string;
}