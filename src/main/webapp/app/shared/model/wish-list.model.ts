import { IProduct } from 'app/shared/model/product.model';
import { ICustomer } from 'app/shared/model/customer.model';

export interface IWishList {
  id?: number;
  title?: string;
  restricted?: boolean;
  products?: IProduct[];
  customer?: ICustomer;
}

export const defaultValue: Readonly<IWishList> = {
  restricted: false
};
