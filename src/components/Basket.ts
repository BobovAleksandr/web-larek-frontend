import { ensureElement } from "../utils/utils";
import { Component } from "./base/component";
import { IEvents } from "./base/events";
import { currency } from "../utils/constants";

export class Basket extends Component {
  protected _title: HTMLHeadElement;
  protected _content: HTMLUListElement;
  protected _button: HTMLButtonElement;
  protected _price: HTMLSpanElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events)

    this._content = ensureElement<HTMLUListElement>('.basket__list', container)
    this._title = ensureElement<HTMLHeadElement>('.modal__title', container)
    this._price = ensureElement<HTMLSpanElement>('.basket__price', container)
    this._button = ensureElement<HTMLButtonElement>('.basket__button', container)

    this._button.addEventListener('click', () => {
      events.emit('basket:submit', this)
    })
  }

  set content(items: HTMLElement[]) {
    this._content.replaceChildren(...items);
  }

  set totalPrice(value: number) {
    this._price.textContent = String(value) + currency
  }

  toggleButtonState(isBasketPositive: boolean) {
    this.setDisabled(this._button, !isBasketPositive)
  }
}