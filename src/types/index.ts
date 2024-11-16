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
  setItems(items: IProduct[]): void;
  getProduct(id: string): IProduct;
}

export interface IBasket {
  products: IProduct[];
  add(id: string): void;
  remove(id: string): void;
  clear(): void;
  makeOrder(): IOrder;
}

export class Basket {
  products: IProduct[];

  constructor() {
    this.products = []
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

  makeOrder() {
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
  paymentMethod: Payment;
  shippingAdress: string;
  email: string;
  phone: string;

  constructor(orderObject: IOrder) {
    this.products = orderObject.products
    this.paymentMethod = orderObject.paymentMethod
    this.shippingAdress = orderObject.shippingAdress
    this.email = orderObject.email
    this.phone = orderObject.phone
  }

}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  baseUrl: string;
  get<T>(url: string): Promise<T>;
  post<T>(orl: string, data: object, method?: ApiPostMethods): Promise<T>;
}





