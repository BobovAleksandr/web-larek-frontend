import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IPage {
  basketCounter: number;
}

export class Page extends Component implements IPage {
  protected _basketButton: HTMLButtonElement;
  protected _basketCounter: HTMLSpanElement;
  protected _cardsGallery: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events)
    
    this._basketButton = ensureElement<HTMLButtonElement>('.header__basket')
    this._basketCounter = ensureElement<HTMLSpanElement>('.header__basket-counter')
    this._cardsGallery = ensureElement<HTMLElement>('.gallery')

    this._basketButton.addEventListener('click', () => {
      this.events.emit('basket:open')
    })
  }

  set basketCounter(value: number) {
    this.setText(this._basketCounter, String(value))
  }

  setCatalog(items: HTMLElement[]) {
    this._cardsGallery.replaceChildren(...items)
  }   
}

