import { IProduct } from "../types";
import { CategorySelectors, CDN_URL } from "../utils/constants";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/component";
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

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events)
    
    this._title = ensureElement<HTMLHeadElement>(`.card__title`, this.container);
    this._price = ensureElement<HTMLHeadElement>(`.card__price`, this.container);
  }

  render(product: IProduct): HTMLElement {
    this.product = product
    this._title.textContent = product.title;
    this._price.textContent =  (product.price ?? '0') + currency;
    const parentRender = super.render()
    return parentRender;
  }

  set product(product: IProduct) {
    this._product = product
  }

  get product() {
    return this._product
  }
}

// Карточка товара (корзина)
export class CardBasket extends Card {
  protected _index: HTMLSpanElement;
  
  constructor(container: HTMLElement, events: IEvents) {
    super(container, events)

    this._index = ensureElement<HTMLSpanElement>('.basket__item-index', this.container)
    this._button = ensureElement<HTMLButtonElement>(`.card__button`, this.container);
    this._button.addEventListener('click', () => {
      this.events.emit('basketCardButton:pressed', this.product)
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
export class CardCatalog extends Card {
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
export class CardPreview extends CardCatalog {
  constructor(container: HTMLElement, events: IEvents) {
    super(container, events)

    this._image = ensureElement<HTMLImageElement>('.card__image', this.container)
    this._category = ensureElement('.card__category', this.container)
    this._description = ensureElement<HTMLParagraphElement>(`.card__text`, this.container);       
    this._button = ensureElement<HTMLButtonElement>(`.card__button`, this.container);
    
    this._button.addEventListener('click', () => {
      this.events.emit('cardPreviewButton:pressed', this.product)
    })
  }

  changeButtonText(isInBasket: boolean) {
    const currentText = isInBasket ? 'Убрать из корзины' : 'В корзину'
    this._button.textContent = currentText;
  }

  render(product: IProduct): HTMLElement {
    this._description.textContent = product.description;
    if (!product.price) {
      this.setDisabled(this._button, true)
    } else {
      this.setDisabled(this._button, false)
    }
    this._category.textContent = product.category;
    this._category.classList.add(`card__category_${CategorySelectors[product.category]}`)
   
    const parentRender = super.render(product)
    return parentRender;
  }
}