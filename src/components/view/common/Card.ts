import { IProduct } from "../../../types";
import { currency } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { Component } from "./Component";
import { IEvents } from "../../base/events";

export abstract class Card extends Component {
  protected _title: HTMLHeadElement;
  protected _price: HTMLSpanElement;
  protected _product: IProduct;
  protected _button: HTMLButtonElement;
  protected _category?: HTMLSpanElement;
  protected _image?: HTMLImageElement;
  protected _description?: HTMLParagraphElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events)
    
    this._title = ensureElement<HTMLHeadElement>(`.card__title`, this.container);
    this._price = ensureElement<HTMLHeadElement>(`.card__price`, this.container);
  }

  render(product: IProduct): HTMLElement {
    this._product = product
    this._title.textContent = product.title;
    this._price.textContent = (product.price ?? '0') + currency;
    return super.render()
  }
}