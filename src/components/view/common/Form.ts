import { ContactsFormData, OrderFormData } from "../../../types";
import { ensureAllElements, ensureElement } from "../../../utils/utils";
import { Component } from "./Component";
import { IEvents } from "../../base/events";

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
  
    this.container.addEventListener('submit', (event: Event) => {
      this.formSubmit(event)
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

  protected abstract handleFormChange(): void
}

export class OrderForm extends Form {
  protected _paymentButtons: HTMLButtonElement[];
  protected _addressInput: HTMLInputElement;
  protected _activePaymentButton: HTMLButtonElement = null;

  constructor(container: HTMLFormElement, events: IEvents) {
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

  protected handleFormChange(): void {
    this.events.emit(`${this.container.name}Form:changed`, <OrderFormData>{
      address: this._addressInput.value.trim(),
      payment: this._activePaymentButton?.name ?? null
    })
  }

  private resetButtons(): void {
    this._paymentButtons.forEach(button => {
      button.classList.remove('button_alt-active')
    })
  }

  formSubmit(e: Event): void {
    super.formSubmit(e)
    this.events.emit(`${this.container.name}Form:submit`, { 
      address: this._addressInput.value.trim(), 
      payment: this._activePaymentButton.name
    });
  }
}

export class ContactsForm extends Form {
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
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

  protected handleFormChange(): void {
    this.events.emit(`${this.container.name}Form:changed`, <ContactsFormData>{
      email: this._emailInput.value.trim(),
      phone: this._phoneInput.value.trim(),
    })
  }
}
