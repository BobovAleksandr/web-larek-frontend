import { IEvents } from "../components/base/events";

export type Category = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил'

export type Currency = ' синапсов'

export interface IProduct {
  id: string;
  title: string;
  category: Category;
  description: string;
  image: string;
  price: number;
}

export interface IProductList {
  products: IProduct[];
  events: IEvents;
  selectedProduct: string;
  getSelectedProduct(): IProduct;
}

export type Payment = 'card' | 'cash'

export type IOrder = {
  payment: Payment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export type OrderFormData = {
  address: string;
  payment: Payment;
}

export type ContactsFormData = {
  phone: string;
  email: string;
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  get<T>(url: string): Promise<T>;
  post<T>(orl: string, data: object, method?: ApiPostMethods): Promise<T>;
}



