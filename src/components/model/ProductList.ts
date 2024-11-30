import { IProduct } from "../../types";
import { IEvents } from "../base/events";

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


















