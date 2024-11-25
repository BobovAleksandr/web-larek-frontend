import { ensureAllElements, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export abstract class Form extends Component {
  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;
  protected _content: HTMLElement;

  constructor(protected container: HTMLFormElement, events: IEvents) {
    super(container, events)

    this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
    this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

    this.container.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.events.emit(`${this.container.name}:submit`);
    });

    this.container.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement
      console.log(target)
      this.events.emit(`${target.name}:input`, {
        field: target.name,
        value: target.textContent,
      })
    })
  }

  set valid(value: boolean) {
    this._submit.disabled = !value;
}

  set errors(value: string) {
      this.setText(this._errors, value);
  }
}

// Форма с типом оплаты и адресом
export class OrderForm extends Form {
  protected _paymentButtons: HTMLButtonElement[];

  constructor(protected container: HTMLFormElement, events: IEvents) {
    super(container, events)

    this._paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt', this.container);

    this._paymentButtons.forEach(button => button.addEventListener('click', (event: Event) => {
      const target = event.target as HTMLButtonElement
      this.events.emit<Record<string, string>>(`paymentButton:pressed`, { payment: target.name })
    }))
  } 

  setButtonActive(button: string) {
    return ensureElement(`button[name=${button}]`, this.container).classList.add('button_alt-active')
  }

  resetButtonsState() {
    this._paymentButtons.forEach(button => {
      button.classList.remove('button_alt-active')
    })
  }
}