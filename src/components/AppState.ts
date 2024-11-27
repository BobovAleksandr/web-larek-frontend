import { IProduct, IOrder, OrderFormData, ContactsFormData } from "../types";
import { emailRegEx, phoneRegEx } from "../utils/constants";
import { IEvents } from "./base/events";

export class AppState {
  protected _products: IProduct[] = [];
  protected _basketProducts: IProduct[] = [];
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
    if (this._basketProducts.includes(product)) {
      this._basketProducts = this._basketProducts.filter(item => item.id !== product.id)
    } else {
      this._basketProducts.push(product)
    }
    this.events.emit('basket:changed', this._basketProducts)
  }

  get totalBasketPrice(): number {
    return this._basketProducts.reduce((sum, product) => sum + product.price, 0)
  }

  clearAllData(): void {
    this._basketProducts.length = 0
    this._order.payment = null;
    this._order.email = '';
    this._order.phone = '';
    this._order.address = '';
    this._order.total = 0;
    this._order.items = [];
    this.events.emit('allData:cleared')
    this.events.emit('basket:changed')
  }

  private isProductInBasket(product: IProduct): boolean {
    return this._basketProducts.includes(product)
  }

  setCatalog(items: IProduct[]): void {
    this._products = items
    this.events.emit('catalog:changed', this._products)
  }

  get basketProducts() {
    return this._basketProducts
  }

  set currentProduct(product: IProduct | null) {
    if (product) {
      this._currentProduct = product
      this.events.emit('product:selected', { 
        product: this._currentProduct,
        isProductInBasket: this.isProductInBasket(this._currentProduct)
      })
    }
  }

  get currentProduct() {
    return this._currentProduct;
  }

  set orderProductsData(items: IProduct[]) {
    this._order.items = items.map(product => product.id)
    this._order.total = items.reduce((sum, product) => sum + product.price, 0)
    this.events.emit('orderProductsData:changed')
  }

  set orderFormData(data: OrderFormData) {
    this._order.address = data.address;
    this._order.payment = data.payment;
    this.events.emit('orderData:changed')
  }

  set contactsFormData(data: ContactsFormData) {
    this._order.email = data.email
    this._order.phone = data.phone
    this.events.emit('contactsData:changed', this._order)
  }
  
  checkOrderFormValid(data: OrderFormData): void {
    const validity: { status: boolean, error: string } = {
      status: false,
      error: ''
    }
    if (!data.payment) {
      validity.status = false
      validity.error = 'Выберите способ оплаты'
    } 
    if (data.address === '') {
      validity.status = false
      validity.error = 'Укажите ваш адрес'
    } else if (data.payment && data.address) {
      validity.status = true,
      validity.error = ''
    }
    this.events.emit('orderForm:checked', validity)
  }

  checkContactsFormValid(data: ContactsFormData) {
    const validity: { status: boolean, error: string } = {
      status: true,
      error: ''
    }
    if (!data.phone && !data.email) {
      validity.status = false
      validity.error = 'Заполните необходимые поля'
    }
    if (!data.email || data.email.trim() === '') {
      validity.status = false
      validity.error = 'Укажите ваш email'
    } 
    if (!data.email.match(emailRegEx)) {
      validity.status = false
      validity.error = 'Некорректный формат email'
    } // TODO проверить валидацию
    if (!data.phone || data.phone.trim() === '') {
      validity.status = false
      validity.error = 'Укажите ваш номер телефона'
    } 
    if (!data.phone.match(phoneRegEx)) {
      validity.status = false
      validity.error = 'Некорректный формат номера телефона'
    } else if (data.phone.match(phoneRegEx) && data.email.match(emailRegEx)) {
      validity.status = true,
      validity.error = ''
    }
    this.events.emit('contactsForm:checked', validity)
  }
}