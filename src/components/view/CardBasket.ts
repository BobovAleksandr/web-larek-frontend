import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Card } from "./common/Card";

// Карточка товара (корзина)
export class CardBasket extends Card {
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
}