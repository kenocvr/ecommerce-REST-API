import { IWishList } from 'app/shared/model/wish-list.model';
import { IAddress } from 'app/shared/model/address.model';

export interface ICustomer {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  telephone?: string;
  wishLists?: IWishList[];
  addresses?: IAddress[];
}

export const defaultValue: Readonly<ICustomer> = {};
