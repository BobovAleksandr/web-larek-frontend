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

// TODO Добавить в readme интерфейс
export interface IProductList {
  products: IProduct[];
  events: IEvents;
  selectedProduct: string;
  productById(id: string): IProduct;
  getSelectedProduct(): IProduct;
}

export class ProductList implements IProductList {
  protected _products: IProduct[];
  protected currentProduct: IProduct | null;
  events: IEvents;

  constructor(events: IEvents) {
    this.events = events
  }

  set products(products: IProduct[]) {
    this._products = products;
    this.events.emit('productList:changed', this.products)
  }

  get products() {
    return this._products;
  }

  set selectedProduct(id: string) {
    this.currentProduct = this.products.find(product => product.id === id)
  }

  productById(id: string) {
    return this.products.find(product => product.id === id)
  }

  getSelectedProduct(): IProduct {
    return this.currentProduct;
  };

}

export interface IBasket {
  changeProducts(newProduct: IProduct): void;
  clear(): void;
  totalPrice: string;
  products: IProduct[];
}

export class Basket implements IBasket {
  protected _products: IProduct[];

  constructor() {
    this._products = []
  }

  changeProducts(newProduct: IProduct) {
    if (this._products.find(product => product.id === newProduct.id)) {
      this._products = this._products.filter(product => product.id !== newProduct.id)
    } else {
      this._products.push(newProduct)
    }
  }

  clear() {
    this._products.length = 0
  }

  get totalPrice() {
    return String(this._products.reduce((sum, el) => sum + el.price, 0))
  }

  get products() {
    return this._products
  }
}

// TODO поправить описание basket

type Payment = 'Онлайн' | 'При получении'

interface IOrder {
  products: IProduct[];
  paymentMethod: string;
  email: string;
  phone: string;
  shippingAdress: string;
}

export class Order {
  products: IProduct[];

  constructor(products: IProduct[]) {
    this.products = products
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



