import { IProduct } from "../../types";
import { CategorySelectors } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { CardCatalog } from "./CardCatalog";

// Карточка товара (превью)
export class CardPreview extends CardCatalog {
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