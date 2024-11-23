import { IProduct, IOrder } from "../types";
import { IEvents } from "./base/events";

export class AppState {
  protected _basket: string[] = [];
  products: IProduct[] = [];
  order: IOrder = {
    payment: null,
    email: '',
    phone: '',
    adress: '',
    total: 0,
    items: [],
  };
  
  constructor(protected events: IEvents) {
    this.events = events
  }

  toggleBasketProduct(product: IProduct) {
    const isProductinBasket: boolean = this._basket.includes(product.id)
    if (isProductinBasket) {
      this._basket = this._basket.filter(item => item !== product.id)
    } else {
      this._basket.push(product.id)
    }
    this.events.emit('basket:changed', this._basket)
  }

  clearBasket() {
    this._basket.length = 0
    this.events.emit('basket:cleared')
  }

  getTotal(): number {
    return this.products.reduce((sum, product) => sum + product.price, 0)
  }

  addItemsToOrder() {
    this.order.items.push(...this._basket)
    this.events.emit('order:created', this.order)
  }

  clearOrder() {
    this.order.payment = null;
    this.order.email = '';
    this.order.phone = '';
    this.order.adress = '';
    this.order.total = 0;
    this.order.items = [];
    this.events.emit('order:cleared')
  }

  setCatalog(items: IProduct[]) {
    this.products = items
    this.events.emit('catalog:changed', this.products)
  }


}