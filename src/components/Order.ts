import { IEvents } from "./base/events";
import { Component } from "./base/baseComponent";

export class Order extends Component {
  protected title: HTMLElement;
  protected orderForm: HTMLFormElement;
  protected buttonsPayment: NodeListOf<HTMLButtonElement>;
  protected buttonCard: HTMLButtonElement;
  protected buttonCash: HTMLButtonElement;
  protected inputAdress: HTMLInputElement;
  protected buttonSubmit: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template, events)
    this.title = this.element.querySelector('.modal__title')
    this.buttonsPayment = this.element.querySelectorAll('.order__buttons')
    this.orderForm = this.element.querySelector('.form')
    this.buttonCard = this.orderForm.querySelector('button[name="card"]')
    this.buttonCash = this.orderForm.querySelector('button[name="cash"]')
    this.inputAdress = this.orderForm.querySelector('button[name="address"]')
    this.buttonSubmit = this.orderForm.querySelector('order__button')

    this.buttonsPayment.forEach((button) => {
      button.addEventListener('click', this.handleButtonClick.bind(this));
    });
  }

  private handleButtonClick(event: MouseEvent) {
    const target = event.target as HTMLButtonElement;
    this.buttonsPayment.forEach((button) => {
      button.classList.remove('button_alt-active');
    });
    target.classList.add('button_alt-active');
  }

  private paymentMethod(): string {
    return [...this.buttonsPayment].find(button => button.classList.contains('button_alt-active')).textContent
  }

  set valid(isValid: boolean) {
    this.buttonSubmit.disabled = !isValid
  }

  get inputsValues() {
    const valuesObject: Record<string, string> = {};
    valuesObject.paymentMethod = this.paymentMethod()
    valuesObject.shippingAdress = this.inputAdress.value
    return valuesObject;
  }

}