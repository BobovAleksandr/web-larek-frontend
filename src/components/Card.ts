import { IProduct } from "../types";
import { CategorySelectors, templates } from "../utils/constants";
import { cloneTemplate, ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export const currency = ' синапсов'

abstract class Card extends Component {
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
}

// Элемент карточки корзины
export class CardBasket extends Card {
  protected _index: HTMLSpanElement;
  
  constructor(container: HTMLElement, events: IEvents, product: IProduct) {
    super(container, events, product)

    this._index = ensureElement<HTMLSpanElement>('.basket__item-index', container)
    this._button = ensureElement<HTMLButtonElement>(`.card__button`, container);
    
    this._button.addEventListener('click', () => {
      events.emit('card:deleted', this._product)
    })
  }

  set index(value: number) {
    this._index.textContent = String(value)
  }
}


export class CardCatalog extends Card {
  constructor(container: HTMLElement, events: IEvents, product: IProduct) {
    super(container, events, product)

    this._image = ensureElement<HTMLImageElement>('.card__image', container)
    // TODO картинки с сервера
    // this.setImage(this._image, product.image, product.title) 
    this._category = ensureElement('.card__category', container)
    this._category.classList.add(`card__category_${CategorySelectors[this._product.category]}`)
    this.setText(this._category, this._product.category)

    container.addEventListener('click', () => {
      events.emit('card:open', this._product)
    })
  }
}


export class CardPreview extends CardCatalog {
  constructor(container: HTMLElement, events: IEvents, product: IProduct) {
    super(container, events, product)

    this._image = ensureElement<HTMLImageElement>('.card__image', container)
    // TODO картинки с сервера
    // this.setImage(this._image, product.image, product.title) 
    this._category = ensureElement('.card__category', container)
    this._category.classList.add(`card__category_${CategorySelectors[this._product.category]}`)
    this.setText(this._category, this._product.category)
    this._description = ensureElement<HTMLParagraphElement>(`.card__text`, container);       
    this.setText(this._description, this._product.description)    
    this._button = ensureElement<HTMLButtonElement>(`.card__button`, container);
    if (!this._product.price) {
      this.setDisabled(this._button, true)
    }

    this._button.addEventListener('click', () => {
      events.emit('card:buttonPressed', this._product)
    })
  }

  changeButtontext(isInBasket: boolean) {
    if (isInBasket) {
      this.setText(this._button, isInBasket ? 'В корзину' : 'Убрать из корзины')
    }
  }
}