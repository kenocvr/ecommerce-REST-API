import { ICustomer } from 'app/shared/model/customer.model';

export interface IAddress {
  id?: number;
  address1?: string;
  address2?: string;
  city?: string;
  postcode?: string;
  country?: string;
  customer?: ICustomer;
}

export const defaultValue: Readonly<IAddress> = {};
