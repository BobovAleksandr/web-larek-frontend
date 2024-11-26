import { Payment } from "../../types";
import { ensureAllElements, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export class Form extends Component {
  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;
  protected _content: HTMLElement;
  
  constructor(protected container: HTMLFormElement, events: IEvents) {
    super(container, events)

    this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
    this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
  
    this.container.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement
      console.log(target)
      this.events.emit(`${target.name}:input`, {
        field: target.name,
        value: target.textContent,
      })
    })

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

  formSubmit(e: Event) {
    e.preventDefault();
  }
}

// Форма с типом оплаты и адресом
export class OrderForm extends Form {
  protected _paymentButtons: HTMLButtonElement[];
  protected _addressInput: HTMLInputElement;
  protected _activePaymentButton: HTMLButtonElement;

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
      })
    })
  } 

  private resetButtons() {
    this._paymentButtons.forEach(button => {
      button.classList.remove('button_alt-active')
    })
  }

  formSubmit(e: Event) {
    super.formSubmit(e)
    this.events.emit<Record<string, string | Payment>>(`${this.container.name}:submit`, { 
      address: this._addressInput.value, 
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

  formSubmit(e: Event) {
    super.formSubmit(e)
    this.events.emit<Record<string, string>>(`${this.container.name}:submit`, { 
      email: this._emailInput.value, 
      phone: this._phoneInput.value 
    });
  }
}


// TODO - Валидация форм