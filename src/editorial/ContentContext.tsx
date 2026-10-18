import {createContext} from 'react';
import type { EditorialMedia } from './types';
export type ContentLink={id:string;slug:string;title:string;summary:string;type:string;topic_cluster?:string;cover?:EditorialMedia};
export const ContentContext=createContext<ContentLink[]>([]);
