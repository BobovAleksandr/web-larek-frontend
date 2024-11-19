import { IEvents } from "./base/events";
import { BaseComponent } from "./base/baseComponent";

export class SuccessComponent extends BaseComponent {
  protected title: HTMLElement;
  protected description: HTMLParagraphElement;
  protected buttonClose: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template, events)
    this.title = this.element.querySelector('.order-success__title')
    this.description = this.element.querySelector('.order-success__description')
    this.buttonClose = this.element.querySelector('.order-success__close')

    this.buttonClose.addEventListener('click', () => {
      this.events.emit('success:close')
    })
  }

  render(totalPrice: number) {
    this.description.textContent = `Списано ${totalPrice} синапсов`
    return this.element
  }
}