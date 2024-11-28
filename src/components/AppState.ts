import { IProduct, IOrder, OrderFormData, ContactsFormData } from "../types";
import { emailRegEx, phoneRegEx } from "../utils/constants";
import { IEvents } from "./base/events";

export class AppState {
  protected _products: IProduct[] = [];
  protected _basketProducts: IProduct[] = [];
  protected _selectedProduct: IProduct;
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

  toggleBasketProduct(product: IProduct): void {
    if (this._basketProducts.includes(product)) {
      this._basketProducts = this._basketProducts.filter(item => item.id !== product.id)
      if (this._selectedProduct) {
        this.events.emit('card:productChanged', {isProductInBasket: this.isProductInBasket(product)})
      } else {
        this.basketInit()
      }
    } else {
      this._basketProducts.push(product)
      this.events.emit('card:productChanged', {isProductInBasket: this.isProductInBasket(product)})
    }
    this.events.emit('basket:amountChanged', { value: String(this._basketProducts.length) })
  }
  
  private get totalBasketPrice(): number {
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
    this.events.emit('allData:cleared', { basketProducts: this._basketProducts.length })
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

  private isProductInBasket(product: IProduct): boolean {
    return this._basketProducts.includes(product)
  }

  setCatalog(items: IProduct[]): void {
    this._products = items
    this.events.emit('catalog:changed', this._products)
  }

  get basketProducts(): IProduct[] {
    return this._basketProducts
  }

  set selectedProduct(product: IProduct | null) {
    this._selectedProduct = product
    if (product) {
      this.events.emit('product:selected', { 
        product: this._selectedProduct,
        isProductInBasket: this.isProductInBasket(this._selectedProduct)
      })
    }
  }

  get selectedProduct() {
    return this._selectedProduct;
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