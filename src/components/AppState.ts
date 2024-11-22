import { IProduct, IOrder } from "../types/NEW index";
import { IEvents } from "./base/events";

export class AppState {
  basket: string[] = [];
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

  toggleBasketProduct(id: string) {
    if (this.basket.includes(id)) {
      this.basket = this.basket.filter(item => item !== id)
    } else {
      this.basket.push(id)
    }
    this.events.emit('basket:changed', this.basket)
  }

  clearBasket() {
    this.basket.length = 0
    this.events.emit('basket:cleared')
  }

  getTotal(): number {
    return this.products.reduce((sum, product) => sum + product.price, 0)
  }

  addItemsToOrder() {
    this.order.items.push(...this.basket)
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