import { BaseComponent } from "./baseComponent";
import { IEvents } from "./events";

export class FormComponent extends BaseComponent {
  protected form: HTMLFormElement;
  protected title: HTMLHeadElement;
  protected buttonSubmit: HTMLButtonElement;
  protected errorContainer: HTMLSpanElement;
  protected inputs: NodeListOf<HTMLInputElement>;

  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template, events)
    this.form = this.element as HTMLFormElement
    this.title = this.element.querySelector('.modal__title')
    this.buttonSubmit = this.element.querySelector('button[type="submit"]')
    this.errorContainer = this.element.querySelector('.form__errors')
    this.inputs = this.element.querySelectorAll('.form__input')

    this.inputs.forEach(input => {
      input.addEventListener('input', () => {
        events.emit(`${input.name}:change`, { input })
      })
    })

    this.form.addEventListener('submit', () => {
      events.emit(`${this.form.name}:submit`, { data: this.inputsValues })
    })
  }

  get inputsValues() {
    const valuesObject: Record<string, string> = {};
    this.inputs.forEach(input => {
      valuesObject[input.name] = input.value;
    })
    return valuesObject;
  }

  set valid(isValid: boolean) {
    this.valid = isValid;
    this.buttonSubmit.disabled = !isValid;
  }

  protected checkValid(errorMessage?: string) {
    if (this.valid) {
      this.showInputError(errorMessage);
    } else {
      this.hideInputError();
    }
  }

  protected showInputError(errorMessage: string) {
    this.errorContainer.textContent = errorMessage;
  }

  protected hideInputError() {
    this.errorContainer.textContent = '';
  }

  reset() {
    this.form.reset()
    this.hideInputError()
  }

  render() {
    return this.form
  }
}
