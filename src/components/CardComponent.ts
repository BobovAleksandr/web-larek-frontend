import { IProduct } from "../types";
import { IEvents } from "./base/events";
import { BaseComponent } from "./base/baseComponent";
import { settings, CategorySelectors } from "../utils/constants";

export class CardComponent extends BaseComponent {
  protected element: HTMLElement | HTMLButtonElement;
  protected title: HTMLElement;
  protected category: HTMLSpanElement | undefined;
  protected description: HTMLParagraphElement | undefined;
  protected price: HTMLSpanElement;
  protected image: HTMLImageElement | undefined;
  protected button: HTMLButtonElement | undefined;
  protected basketIndex: HTMLSpanElement | undefined;
  protected _product: IProduct;
  protected currency: string;

  constructor(template: HTMLTemplateElement, events: IEvents, product: IProduct) {
    super(template, events);
    this._product = product;
    this.currency = settings.currency;
    this.title = this.element.querySelector('.card__title');
    this.button = this.element.querySelector('.card__button');
    this.category = this.element.querySelector('.card__category');
    this.description = this.element.querySelector('.card__text');
    this.basketIndex = this.element.querySelector('.basket__item-index')
    this.price = this.element.querySelector('.card__price');
    this.image = this.element.querySelector('.card__image');
    
    if (this.element instanceof HTMLButtonElement) {
      this.element.addEventListener('click', () => {
        this.events.emit('card:open', this);
      })
    }
    
    if (this.button) {
      this.button.addEventListener('click', () => {
        this.events.emit('card:changeBasket', this);
      })
    }
  }

  get product() {
    return this._product
  }

  get isBasketCard():boolean {
    return this.element.classList.contains('card_compact')
  }

  // changeButtonText(basketProducts: IProduct[]) {
  //   this.button.textContent = basketProducts.some(product => product.id === this.id) ? 'Убрать из корзины' : 'В корзину'
  // }

  deleteCard() {
    this.element.remove();
    this.element = null;
  }

  render(): HTMLElement {
    this.price.textContent = (this.product.price ?? '0') + this.currency;
    this.title.textContent = this.product.title;
    // if (this.basketIndex) { this.basketIndex.textContent = product. }
    if (this.category) { this.category.textContent = this.product.category };
    if (this.category) { this.category.classList.add(`card__category_${CategorySelectors[this.product.category]}`) }
    if (this.description) { this.description.textContent = this.product.description }
    if (this.image) {
      // this.image.src = `${cardData.image}`;
      this.image.alt = this.product.title;
    }
    if (this.button && this.product.price === null) { this.button.disabled = true }
    return this.element
  }
}

// TODO - загрузка картинок - https://larek-api.nomoreparties.co/content/weblarek/Shell.svg

// TODO поправить описание класса
