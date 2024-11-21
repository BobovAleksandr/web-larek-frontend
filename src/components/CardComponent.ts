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
  protected cardId: string;
  protected currency: string;

  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template, events);
    this.currency = settings.currency;
    this.title = this.element.querySelector('.card__title');
    this.button = this.element.querySelector('.card__button');
    this.category = this.element.querySelector('.card__category');
    this.description = this.element.querySelector('.card__text');
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

  get isBasketCard():boolean {
    return this.element.classList.contains('card_compact')
  }

  get id() {
    return this.cardId
  }

  changeButtonText(basketProducts: IProduct[]) {
    this.button.textContent = basketProducts.some(product => product.id === this.id) ? 'Убрать из корзины' : 'В корзину'
  }

  deleteCard() {
    this.element.remove();
    this.element = null;
  }

  render(product: IProduct): HTMLElement {
    this.cardId = product.id
    this.price.textContent = (product.price ?? '0') + this.currency;
    this.title.textContent = product.title;
    if (this.category) {this.category.textContent = product.category};
    if (this.category) { this.category.classList.add(`card__category_${CategorySelectors[product.category]}`) }
    if (this.description) { this.description.textContent = product.description }
    if (this.image) {
      // this.image.src = `${cardData.image}`;
      this.image.alt = product.title;
    }
    if (this.button && product.price === null) { this.button.disabled = true }
    return this.element
  }
}

// TODO - загрузка картинок - https://larek-api.nomoreparties.co/content/weblarek/Shell.svg

// TODO поправить описание класса
