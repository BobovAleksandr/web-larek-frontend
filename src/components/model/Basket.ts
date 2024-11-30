import { IProduct } from "../../types";
import { IEvents } from "../base/events";

export class Basket {
  protected _basketProducts: IProduct[] = [];

  constructor(protected events: IEvents) {
    this.events = events
  }

  basketInit(): void {
    if (this._basketProducts) {
      this.events.emit('basket:changed', {
        products: this._basketProducts,
        totalBasketPrice: this.totalBasketPrice,
        isBasketPositive: this.totalBasketPrice > 0
      })
    } 
    this.events.emit('basket:init', { isBasketPositive: this.totalBasketPrice > 0 })
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