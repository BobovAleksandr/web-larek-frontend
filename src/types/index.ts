export type Payment = 'card' | 'cash'

export type Category = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил'

export type OrderFormData = {
  form: HTMLFormElement;
  address: string;
  payment: Payment;
}

export type ContactsFormData = {
  form: HTMLFormElement;
  phone: string;
  email: string;
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  get<T>(url: string): Promise<T>;
  post<T>(orl: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
  id: string;
  title: string;
  category: Category;
  description: string;
  image: string;
  price: number;
}

export interface IOrder {
  payment: Payment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}