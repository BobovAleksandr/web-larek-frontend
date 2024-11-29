import { IProduct, IOrder, OrderFormData, ContactsFormData, Payment } from "../types";
import { emailRegEx, phoneRegEx } from "../utils/constants";
import { IEvents } from "./base/events";

export class ProductList {
  protected _products: IProduct[] = [];
  protected _selectedProduct: IProduct;

  constructor(protected events: IEvents) {
      this.events = events
  }

  setCatalog(items: IProduct[]): void {
    this._products = items
    this.events.emit('catalog:changed', this._products)
  }

  set selectedProduct(product: IProduct | null) {
    this._selectedProduct = product
    if (product) {
      this.events.emit('product:selected', { product: this._selectedProduct })
    }
  }

  get selectedProduct() {
    return this._selectedProduct;
  }
}

export class Basket {
  protected _basketProducts: IProduct[] = [];

  constructor(protected events: IEvents) {
    this.events = events
  }

  basketInit() {
    if (this._basketProducts) {
      this.events.emit('basket:changed', {
        products: this._basketProducts,
        totalBasketPrice: this.totalBasketPrice,
        isBasketPositive: this.totalBasketPrice > 0
      })
    } 
    this.events.emit('basket:open', { isBasketPositive: this.totalBasketPrice > 0 })
  }

  get products(): IProduct[] {
    return this._basketProducts
  }

  toggleBasketProduct(product: IProduct): void {
    if (this._basketProducts.includes(product)) {
      this._basketProducts = this._basketProducts.filter(item => item.id !== product.id)
      this.basketInit()
    } else {
      this._basketProducts.push(product)
      this.events.emit('card:productChanged', { isProductInBasket: this.isProductInBasket(product) })
    }
    this.events.emit('basketAmount:Changed', { amount: this._basketProducts.length })
  }
  
  
  isProductInBasket(product: IProduct): boolean {
    return this._basketProducts.includes(product)
  }
  
  private get totalBasketPrice(): number {
    return this._basketProducts.reduce((sum, product) => sum + product.price, 0)
  }

  clearBasket(): void {
    this._basketProducts.length = 0
    this.events.emit('basket:cleared', { basketProducts: this._basketProducts.length })
  }
}

export class Order {
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

  set basketData(data: { items: IProduct[], total: number }) {
    this._order.items = data.items.map(item => item.id);
    this._order.total = data.total;
    this.events.emit('basketData:changed')
  }

  set orderData(data: { payment: Payment, address: string }) {
    this._order.payment = data.payment;
    this._order.address = data.address;
    this.events.emit('orderFormData:changed');
  }

  set contactsData(data: { phone: string, email: string }) {
    this._order.phone = data.phone
    this._order.email = data.email
    this.events.emit('contactsData:changed', this._order)
  }

  cleaerOrder(): void {
    this._order.items.length = 0
    this._order.payment = null
    this._order.address = ''
    this._order.email = ''
    this._order.phone = ''
    this._order.total = 0
  }
}

export class Validator {

  constructor(protected events: IEvents) {
    this.events = events
  }

  checkOrderForm(data: OrderFormData): void {
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
  
  checkContactsFormValid(data: ContactsFormData): void {
    const validity: { status: boolean, error: string } = {
      status: false,
      error: ''
    }
    if (!data.phone && !data.email) {
      validity.error = 'Заполните необходимые поля'
    }
    if (!data.email || data.email.trim() === '') {
      validity.error = 'Укажите ваш email'
    } 
    if (data.email && !data.email.match(emailRegEx)) {
      validity.error = 'Некорректный формат email'
    } 
    if (!data.phone || data.phone.trim() === '') {
      validity.error = 'Укажите ваш номер телефона'
    } 
    if (data.phone && !data.phone.match(phoneRegEx)) {
      validity.error = 'Некорректный формат номера телефона'
    } else if (data.phone.match(phoneRegEx) && data.email.match(emailRegEx)) {
      validity.status = true,
      validity.error = ''
    }
    this.events.emit('contactsForm:checked', validity)
  }  
}












