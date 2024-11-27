import { Payment } from "../../types";
import { ensureAllElements, ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";



export abstract class Form extends Component {
  protected _inputs: HTMLInputElement[];
  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;
  protected _content: HTMLElement;
  
  constructor(protected container: HTMLFormElement, events: IEvents) {
    super(container, events)

    this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
    this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
    this._inputs = ensureAllElements<HTMLInputElement>('.form__input', this.container)
    this._inputs.forEach(input => input.addEventListener('change', this.handleFormChange.bind(this)))
  
    this.container.addEventListener('submit', (e: Event) => {
      this.formSubmit(e)
    });
  }

  set valid(value: boolean) {
    this._submit.disabled = !value;
}

  set errors(value: string) {
    this._errors.textContent = value
  }

  formSubmit(e: Event): void {
    e.preventDefault();
  }

  abstract handleFormChange(): void
}

// Форма с типом оплаты и адресом
export class OrderForm extends Form {
  protected _paymentButtons: HTMLButtonElement[];
  protected _addressInput: HTMLInputElement;
  protected _activePaymentButton: HTMLButtonElement = null;

  constructor(protected container: HTMLFormElement, events: IEvents) {
    super(container, events)

    this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container)
    this._paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt', this.container);
    
    this._paymentButtons.forEach(button => {
      button.addEventListener('click', (event: Event) => {
        this.resetButtons()
        const target = event.target as HTMLButtonElement;
        this._activePaymentButton = target;
        this._activePaymentButton.classList.add('button_alt-active')
        this.handleFormChange()
      })
    })
  } 

  handleFormChange() {
    this.events.emit(`${this.container.name}Form:changed`, { 
      address: String(this._addressInput.value).trim(),
      payment: this._activePaymentButton?.name ?? null
    })
  }

  private resetButtons() {
    this._paymentButtons.forEach(button => {
      button.classList.remove('button_alt-active')
    })
  }

  formSubmit(e: Event): void {
    super.formSubmit(e)
    this.events.emit(`${this.container.name}Form:submit`, { 
      address: String(this._addressInput.value).trim(), 
      payment: this._activePaymentButton.name 
    });
  }
}

export class ContactsForm extends Form {
  
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;

  constructor(protected container: HTMLFormElement, events: IEvents) {
    super(container, events)

    this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container)
    this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container)
  }

  formSubmit(e: Event): void {
    super.formSubmit(e)
    this.events.emit(`${this.container.name}Form:submit`, { 
      email: String(this._emailInput.value).trim(), 
      phone: String(this._phoneInput.value).trim()
    });
  }

  handleFormChange(): void {
    this.events.emit(`${this.container.name}Form:changed`, { 
      email: String(this._emailInput.value).trim(),
      phone: String(this._phoneInput.value).trim(),
    })
  }

}
