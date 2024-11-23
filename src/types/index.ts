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

export type Payment = 'online' | 'offline' | null

export interface IOrder {
  payment: Payment;
  email: string;
  phone: string;
  adress: string;
  total: number;
  items: string[];
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  baseUrl: string;
  get<T>(url: string): Promise<T>;
  post<T>(orl: string, data: object, method?: ApiPostMethods): Promise<T>;
}



