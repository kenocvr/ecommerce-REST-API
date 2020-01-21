import { Moment } from 'moment';
import { IWishList } from 'app/shared/model/wish-list.model';
import { ICategory } from 'app/shared/model/category.model';

export interface IProduct {
  id?: number;
  title?: string;
  keywords?: string;
  description?: string;
  rating?: number;
  dateAdded?: Moment;
  dateModified?: Moment;
  wishList?: IWishList;
  categories?: ICategory[];
}

export const defaultValue: Readonly<IProduct> = {};
