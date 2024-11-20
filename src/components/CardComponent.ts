import { IProduct } from "../types";
import { IEvents } from "./base/events";
import { BaseComponent } from "./base/baseComponent";

enum CategorySelectors {
  'софт-скил' = 'soft',
  'другое' = 'other',
  'дополнительное' = 'additional',
  'кнопка' = 'button',
  'хард-скил' = 'hard',
}

const currency = ' синапсов'

export class CardComponent extends BaseComponent {
  protected element: HTMLElement | HTMLButtonElement;
  protected title: HTMLElement;
  protected category: HTMLSpanElement | undefined;
  protected description: HTMLParagraphElement | undefined;
  protected price: HTMLSpanElement;
  protected image: HTMLImageElement | undefined;
  protected buyButton: HTMLButtonElement | undefined;
  protected deleteButton: HTMLButtonElement | undefined;
  protected cardId: string;
  protected currency: string;

  constructor(template: HTMLTemplateElement, events: IEvents, id: string) {
    super(template, events)
    this.cardId = id;
    this.currency = currency;
    this.title = this.element.querySelector('.card__title')
    this.buyButton = this.element.querySelector('.card__button');
    this.category = this.element.querySelector('.card__category')
    this.description = this.element.querySelector('.card__text')
    this.price = this.element.querySelector('.card__price')
    this.image = this.element.querySelector('.card__image')

    
    if (this.element instanceof HTMLButtonElement) {
      this.element.addEventListener('click', () => {
        this.events.emit('card:open', { cardId: this.cardId })
      })
    }
    
    if (this.buyButton) {
      this.buyButton.addEventListener('click', () => {
        this.events.emit('card:addToBasket', { card: this })
      })
    }

    if (this.deleteButton) {
      this.deleteButton.addEventListener('click', () => {
        this.events.emit('card:removeFromBasket', { card: this })
      })
    }
  }

  deleteCard() {
    this.element.remove();
    this.element = null;
  }

  render(cardData: IProduct): HTMLElement {
    this.category.textContent = cardData.category;
    this.title.textContent = cardData.title;
    this.price.textContent = cardData.price + this.currency;
    if (this.description) { this.description.textContent = cardData.description }
    if (this.category) { this.category.classList.add(`card__category_${CategorySelectors[cardData.category]}`) }
    if (this.image) {
      this.image.src = `./../images/cards/Leaf.svg`;
      this.image.alt = cardData.title;
    }
    return this.element
  }
}

// TODO поправить описание класса