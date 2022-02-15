import { Sponsor } from './sponsor.model';
import { Author, UserInfoExtended } from '@/models/user.model';
import { MediaSource, MediaType } from './media.model';
import firebase from 'firebase/app';
import { AccessSettings } from './access.model';
export interface Post {
  //Auto Generated By Cloud Function
  _id: string;
  _type: PostType;
  _createdAt?: string | number | Date;
  _updatedAt?: string | number | Date;
  createdBy?: string;
  updatedBy?: string;

  //Core Fields
  title: string;
  titleSearch: string;
  status: PostStatus;
  publishedAt?: string | number | Date;
  visibility: PostVisibility;
  excerpt?: string;
  category?: string[] | null; //If null this will be auto assigned 'Unassigned'
  tag?: string[] | null;
  format?: PostFormat; //If null this will be auto assigned 'standard'
  content?: string;
  slug: string;
  historyId?: string;
  postId?: string;
  coverPhoto?: CoverMedia;
  coverVideo?: CoverMedia;
  sections?: Section[];
  authors?: Author[];
  authorIds?: string[]; //uid list of authors

  urlContent?: string; //Used for remote data
  sponsors?: Sponsor[];

  // Payment Fields
  accessSettings?: AccessSettings;
  // Navigation Experience
  navigationSettings?: NavigationSettings;
}

export interface CoverMedia {
  path?: string;
  thumbnail_url?: string;
  public_id?: string;
  mediaId?: string;
  url?: string;
  type: MediaType;
  source: MediaSource;
  secure_url: string;
}

export enum PostStatus {
  published = 'published',
  draft = 'draft',
  pendingreview = 'pendingreview',
}

export enum PostVisibility {
  public = 'public',
  private = 'private',
  password = 'password',
}

export enum PostType {
  post = 'post',
  tutorial = 'tutorial',
  podcast = 'podcast',
  course = 'course',
  lesson = 'lesson',
  page = 'page',
  group = 'group',
  forum = 'forum',
}

export enum PostFormat {
  standard = 'standard',
  video = 'video',
  image = 'image',
  audio = 'audio',
}

export interface Section {
  _key: string;
  title: string;
  lessons?: SectionLesson[];
}

export interface SectionLesson extends Post {
  _id: string;
  slug: string;
  title: string;
}

export enum NavigationSettings {
  linear = 'linear',
  freeform = 'freeform',
}
