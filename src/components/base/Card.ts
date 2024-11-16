import { IProduct } from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { IEvents } from "./events";

enum Category {
  'софт-скил' = 'soft',
  'другое' = 'other',
  'дополнительное' = 'additional',
  'кнопка' = 'button',
  'хард-скил' = 'hard',
}

export class Card {
  protected element: HTMLElement | HTMLButtonElement;
  protected events: IEvents;
  protected title: HTMLElement;
  protected category: HTMLElement | undefined;
  protected description: HTMLElement | undefined;
  protected price: HTMLElement;
  protected image: HTMLImageElement | undefined;
  protected buyButton: HTMLButtonElement | undefined;
  protected deleteButton: HTMLButtonElement | undefined;
  protected cardId: string;
  protected currency: string;

  constructor(template: HTMLTemplateElement, events: IEvents) {
    this.events = events;
    this.element = cloneTemplate(template);
    this.currency = ' синапсов'
    this.title = this.element.querySelector('.card__title')
    this.buyButton = this.element.querySelector('.card__button');
    this.category = this.element.querySelector('.card__category')
    this.description = this.element.querySelector('.card__text')
    this.price = this.element.querySelector('.card__price')
    this.image = this.element.querySelector('.card__image')
    
    if (this instanceof HTMLButtonElement ) {
      this.element.addEventListener('click', () => {
        this.events.emit('card:open', { card: this })
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

  setData(cardData: IProduct): void {
    this.cardId = cardData.id;
    this.category.textContent = cardData.category;
    this.title.textContent = cardData.title;
    this.price.textContent = cardData.price + this.currency;
    if (this.description) { this.description.textContent = cardData.description }
    if (this.category) { this.category.classList.add(`card__category_${Category[cardData.category]}`) }
    if (this.image) {
      this.image.src = cardData.image;
      this.image.alt = cardData.title;
    }
  }

  get id() {
    return this.cardId;
  }

  deleteCard() {
    this.element.remove();
    this.element = null;
  }

  render() {
    return this.element;
  }

}
