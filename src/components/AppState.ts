import { IProduct, IOrder, Payment } from "../types";
import { IEvents } from "./base/events";

export class AppState {
  protected _products: IProduct[] = [];
  protected _basket: IProduct[] = [];
  protected _currentProduct: IProduct;
  protected _order: IOrder = {
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
    if (this._basket.includes(product)) {
      this._basket = this._basket.filter(item => item.id !== product.id)
    } else {
      this._basket.push(product)
    }
    this.events.emit('basket:changed', this._basket)
  }

  clearBasket() {
    this._basket.length = 0
    this.events.emit('basket:cleared')
  }

  get basketTotal(): number {
    return this._basket.reduce((sum, product) => sum + product.price, 0)
  }

  clearOrder(): void {
    this._order.payment = null;
    this._order.email = '';
    this._order.phone = '';
    this._order.adress = '';
    this._order.total = 0;
    this._order.items = [];
    this.events.emit('order:cleared')
  }

  isCurrentProductInBasket(): boolean {
    return this._basket.includes(this._currentProduct)
  }

  setCatalog(items: IProduct[]) {
    this._products = items
    this.events.emit('catalog:changed', this._products)
  }

  get basket() {
    return this._basket
  }

  set currentProduct(product: IProduct) {
    this._currentProduct = product
  }

  get currentProduct() {
    return this._currentProduct;
  }

  set orderPayment(value: Payment) {
    this._order.payment = value
    this.events.emit<Record<string, Payment>>('payment:changed', { payment: value })
  }
}