import { IProduct } from "../types";
import { CategorySelectors, CDN_URL, currency } from "../utils/constants";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export interface ICard {
  render(product: IProduct): HTMLElement;
}

export interface ICardBasket extends ICard {
  index: number;
}

export interface ICardPreview extends ICard {
  changeButtonText(isInBasket: boolean): void;
}

abstract class Card extends Component implements ICard {
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
    const parentRender = super.render()
    return parentRender;
  }
}

// Карточка товара (корзина)
export class CardBasket extends Card implements ICardBasket {
  protected _index: HTMLSpanElement;
  
  constructor(container: HTMLElement, events: IEvents) {
    super(container, events)

    this._index = ensureElement<HTMLSpanElement>('.basket__item-index', this.container)
    this._button = ensureElement<HTMLButtonElement>(`.card__button`, this.container);
    this._button.addEventListener('click', () => {
      this.events.emit('basketCardButton:pressed', this._product)
    })
  }

  set index(value: number) {
    this._index.textContent = String(value)
  }

  render(product: IProduct): HTMLElement {
    const parentRender = super.render(product)
    return parentRender;
  }
}

// Карточка товара (каталог)
export class CardCatalog extends Card implements ICard {
  constructor(container: HTMLElement, events: IEvents) {
    super(container, events)

    this._image = ensureElement<HTMLImageElement>('.card__image', this.container)
    this._category = ensureElement('.card__category', this.container)
  }

  render(product: IProduct): HTMLElement {
    this._category.classList.add(`card__category_${CategorySelectors[product.category]}`)
    this._category.textContent = product.category
    
    this.setImage(this._image, CDN_URL + product.image, product.title)
    this.container.addEventListener('click', () => {
      this.events.emit('catalogCard:pressed', product)
    })

    const parentRender = super.render(product)
    return parentRender;
  }
}

// Карточка товара (превью)
export class CardPreview extends CardCatalog implements ICardPreview {
  constructor(container: HTMLElement, events: IEvents) {
    super(container, events)

    this._image = ensureElement<HTMLImageElement>('.card__image', this.container)
    this._category = ensureElement('.card__category', this.container)
    this._description = ensureElement<HTMLParagraphElement>(`.card__text`, this.container);       
    this._button = ensureElement<HTMLButtonElement>(`.card__button`, this.container);
    
    this._button.addEventListener('click', () => {
      this.events.emit('cardPreviewButton:pressed', this._product)
    })
  }

  changeButtonText(isInBasket: boolean) {
    const currentText = isInBasket ? 'Убрать из корзины' : 'В корзину'
    this._button.textContent = currentText;
  }

  render(product: IProduct): HTMLElement {
    this._description.textContent = product.description;
    this.setDisabled(this._button, Boolean(!product.price))
    this._category.textContent = product.category;
    this._category.classList.add(`card__category_${CategorySelectors[product.category]}`)
    return super.render(product);
  }
}