import { Document } from 'mongoose';
import { Types } from 'mongoose';

export interface Item extends Document {
  userId: Types.ObjectId;
  name?: string;
  description?: string;
  price: number;
  images?: string[];
  title?: string;
  address: string;
  city: string;
  country: string; // Nouveau champ ajouté
  typeOfHousing?: string;
  rooms?: number;
  bedrooms?: number;
  area?: number;
  latitude?: number;
  longitude?: number;
  likes?: string[];
}
