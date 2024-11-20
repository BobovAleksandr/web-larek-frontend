import { IEvents } from "./base/events";

export class BasketIcon {
  protected basketButton: HTMLButtonElement;
  protected basketCounter: HTMLSpanElement;
  protected events: IEvents;

  constructor(basketButton: HTMLButtonElement, events: IEvents) {
    this.events = events;
    this.basketButton = basketButton;
    this.basketCounter = this.basketButton.querySelector('.header__basket-counter')
    this.basketCounter.textContent = '0';

    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open')
    })
  }

  set newCount(count: string) {
    this.basketCounter.textContent = count
  }

  render() {
    return this.basketButton
  }
}

