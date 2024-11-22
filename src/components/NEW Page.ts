import { ensureElement } from "../utils/utils";
import { Component } from "./base/NEW_Component";

interface IPage {
  counter: number;
}

class Page extends Component<IPage> {
  protected _basketButton: HTMLButtonElement;
  protected _basketCounter: HTMLSpanElement;
  protected _cardsGallery: HTMLElement;

  constructor(container: HTMLElement) {
    super(container)
    
    this._basketButton = ensureElement<HTMLButtonElement>('.header__basket')
    this._basketCounter = ensureElement<HTMLSpanElement>('.header__basket-counter')
    this._cardsGallery = ensureElement<HTMLElement>('.gallery')

    this._basketButton.addEventListener('click', () => {
      this.events.emit('basket:open')
    })
  }

  set counter(value: number) {
    this.setText(this._basketCounter, String(value))
  }

  set catalog(items: HTMLElement[]) {
    this._cardsGallery.replaceChildren(...items)
  }   
}

