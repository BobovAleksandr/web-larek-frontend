import { IEvents } from "./base/events";
import { Component } from "./base/NEW_Component";

export class SuccessComponent extends Component {
  protected title: HTMLElement;
  protected description: HTMLParagraphElement;
  protected buttonClose: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template, events)
    this.title = this.container.querySelector('.order-success__title')
    this.description = this.container.querySelector('.order-success__description')
    this.buttonClose = this.container.querySelector('.order-success__close')

    this.buttonClose.addEventListener('click', () => {
      this.events.emit('success:close')
    })
  }

  render(totalPrice: number) {
    this.description.textContent = `Списано ${totalPrice} синапсов`
    return this.container
  }
}