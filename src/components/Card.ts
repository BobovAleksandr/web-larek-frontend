import { IProduct } from "../types";
import { CategorySelectors, templates } from "../utils/constants";
import { cloneTemplate, ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export interface ICard {
  product: IProduct;
  changeButtontext?(isInBasket: boolean): void;
}

const currency = ' синапсов'

abstract class Card extends Component implements Card {
  protected _title: HTMLHeadElement;
  protected _price: HTMLSpanElement;
  protected _product: IProduct;
  protected _button: HTMLButtonElement;
  protected _category?: HTMLSpanElement;
  protected _image?: HTMLImageElement;
  protected _description?: HTMLParagraphElement;

  constructor(container: HTMLElement, events: IEvents, product: IProduct) {
    super(container, events)
    this._product = product
    this._title = ensureElement<HTMLHeadElement>(`.card__title`, container);
    this._price = ensureElement<HTMLHeadElement>(`.card__price`, container);
    this.setText(this._title, product.title)
    this.setText(this._price, (product.price ?? '0') + currency)
  }

  get product(): IProduct {
    return this._product
  }

  render(): HTMLElement {
    return this.container
  }
}


export class CardBasket extends Card implements ICard {
  private static _itemIndex: number = 0;
  protected _index: HTMLSpanElement;
  
  constructor(container: HTMLElement, events: IEvents, product: IProduct) {
    super(container, events, product)

    this._index = ensureElement<HTMLSpanElement>('.basket__item-index', container)
    this._button = ensureElement<HTMLButtonElement>(`.card__button`, container);
    this.setText(this._index, ++CardBasket._itemIndex)
    
    this._button.addEventListener('click', () => {
      events.emit('card:deleted', this.product)
    })
  }
}


export class CardCatalog extends Card implements ICard {
  constructor(container: HTMLElement, events: IEvents, product: IProduct) {
    super(container, events, product)

    this._image = ensureElement<HTMLImageElement>('.card__image', container)
    // TODO картинки с сервера
    // this.setImage(this._image, product.image, product.title) 
    this._category = ensureElement('.card__category', container)
    this._category.classList.add(`card__category_${CategorySelectors[product.category]}`)
    this.setText(this._category, product.category)

    container.addEventListener('click', () => {
      events.emit('card:open', this._product)
    })
  }
}


export class CardPreview extends CardCatalog implements ICard {
  constructor(container: HTMLElement, events: IEvents, product: IProduct) {
    super(container, events, product)

    this._category = ensureElement('.card__category', container)
    this._category.classList.add(`card__category_${CategorySelectors[product.category]}`)
    this.setText(this._category, product.category)
    this._description = ensureElement<HTMLParagraphElement>(`.card__text`, container);       
    this.setText(this._description, product.description)    
    this._button = ensureElement<HTMLButtonElement>(`.card__button`, container);

    this._button.addEventListener('click', () => {
      events.emit('card:buttonPressed', this)
    })
  }

  changeButtontext(isInBasket: boolean) {
    if (isInBasket) {
      this.setText(this._button, isInBasket ? 'В корзину' : 'Убрать из корзины')
    }
  }
}