import { IProduct, IOrder, Payment, OrderFormData, ContactsFormData } from "../types";
import { IEvents } from "./base/events";

export class AppState {
  protected _products: IProduct[] = [];
  protected _basket: IProduct[] = [];
  protected _currentProduct: IProduct;
  protected _order: IOrder = {
    payment: null,
    email: '',
    phone: '',
    address: '',
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

  get totalBasketPrice(): number {
    return this._basket.reduce((sum, product) => sum + product.price, 0)
  }

  clearData(): void {
    this._basket.length = 0
    this._order.payment = null;
    this._order.email = '';
    this._order.phone = '';
    this._order.address = '';
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

  set orderProducts(items: IProduct[]) {
    this._order.items = [...items]
    this.events.emit('orderProducts:changed')
  }

  set orderFormData(data: OrderFormData) {
    this._order.address = data.address;
    this._order.payment = data.payment;
    this.events.emit('orderData:changed')
  }

  set contactsFormData(data: ContactsFormData) {
    this._order.email = data.email
    this._order.phone = data.phone
    this.events.emit('contactsData:changed')
  }
}