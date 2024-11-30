import { IOrder, IProduct, Payment } from "../../types";
import { IEvents } from "../base/events";

export class Order {
  protected _payment: Payment = null;
  protected _email: string = '';
  protected _phone: string = '';
  protected _address: string = '';
  protected _total: number = 0;
  protected _items: string[] = [];
  
  constructor(protected events: IEvents) {
    this.events = events
  }

  set basketData(data: { items: IProduct[] }) {
    this._items = data.items.map(item => item.id);
    this._total = data.items.reduce((sum, product) => sum + product.price, 0)
    this.events.emit('basketData:changed')
  }

  set orderData(data: { payment: Payment, address: string }) {
    this._payment = data.payment;
    this._address = data.address;
    this.events.emit('orderFormData:changed');
  }

  set contactsData(data: { phone: string, email: string }) {
    this._phone = data.phone
    this._email = data.email
    this.events.emit('contactsData:changed', this.order)
  }

  clearOrder(): void {
    this._items.length = 0
    this._payment = null
    this._address = ''
    this._email = ''
    this._phone = ''
    this._total = 0
  }

  get order(): IOrder {
    return {
      items: [...this._items],
      payment: this._payment,
      phone: this._phone,
      email: this._email,
      address: this._address,
      total: this._total,
    }
  }
}