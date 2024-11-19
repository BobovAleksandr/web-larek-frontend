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

export class ProductList {
  products: IProduct[];
  _selectedProduct: IProduct | null;

  constructor(products: IProduct[]) {
    this.products = products;
    this._selectedProduct = null
  }
  
  set selectedProduct(id: string) {
    this._selectedProduct = this.products.find(product => product.id === id)
  }

  get selectedProduct(): IProduct {
    return this._selectedProduct
  };

}

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



