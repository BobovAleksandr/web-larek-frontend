import { IEvents } from "../components/base/events";

type Category = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил'

export interface IProduct {
  id: string;
  title: string;
  category: Category;
  description: string;
  image: string;
  price: number;
}

export class Product implements IProduct {
  id: string;
  title: string;
  category: Category;
  description: string;
  image: string;
  price: number;

  constructor(productObject: IProduct) {
    this.id = productObject.id;
    this.title = productObject.title;
    this.category = productObject.category;
    this.description = productObject.description;
    this.image = productObject.image;
    this.price = productObject.price;
  }
}

export interface IProductList {
  products: IProduct[];
  selectedProduct: string | null;
  totalPrice: number;
  setItems(items: IProduct[]): void;
  getProduct(id: string): IProduct;
}

export interface IBasket {
  products: IProduct[];
  add(id: string): void;
  remove(id: string): void;
  clear(): void;
  createOrder(): IOrder;
}

// TODO слушатели при событиях

export class Basket {
  products: IProduct[];

  constructor(products: IProduct[]) {
    this.products = products
  }

  add(newProduct: IProduct) {
    if (this.products.find(product => product.id === newProduct.id) === undefined) {
      this.products.push(newProduct)
    }
  }

  remove(id: string) {
    this.products = this.products.filter(product => product.id !== id)
  }

  clear() {
    this.products.length = 0
  }

  get totalPrice() {
    return this.products.reduce((sum, el) => sum + el.price, 0)
  }

  createOrder() {
    return this.products
  }
}

type Payment = 'Онлайн' | 'При получении'

export interface IOrder {
  products: IProduct[];
  paymentMethod: Payment;
  shippingAdress: string;
  email: string;
  phone: string;
}

export class Order implements IOrder {
  products: IProduct[];

  constructor(orderObject: IOrder) {
    this.products = orderObject.products
  }

  set paymentMethod(paymentInputValue: Payment) {
    this.paymentMethod = paymentInputValue
  }

  set email(emailInputValue: string) {
    this.email = emailInputValue
  }

  set phone(phoneInputValue: string) {
    this.phone = phoneInputValue
  }

  set shippingAdress(shippingAdressInputValue: string) {
    this.shippingAdress = shippingAdressInputValue
  }

  get newOrder(): IOrder {
    return {
      products: this.products,
      paymentMethod: this.paymentMethod,
      shippingAdress: this.shippingAdress,
      email: this.email,
      phone: this.phone,
    }
  }
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  baseUrl: string;
  get<T>(url: string): Promise<T>;
  post<T>(orl: string, data: object, method?: ApiPostMethods): Promise<T>;
}





