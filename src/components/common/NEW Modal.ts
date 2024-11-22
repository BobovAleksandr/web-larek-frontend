import { ensureElement } from "../../utils/utils";
import { Component } from "../base/NEW_Component";

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component implements IModal {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this._content = ensureElement<HTMLElement>('.modal__content', container);
    this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);

    this._closeButton.addEventListener('click', this.close.bind(this));
    this.container.addEventListener('click', this.close.bind(this));

  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open() {
      this.container.classList.add('modal_active');
      this.events.emit('modal:open');
  }

  close() {
      this.container.classList.remove('modal_active');
      this.content = null;
      this.events.emit('modal:close');
  }

  render(): HTMLElement {
    this.open();
    return this.container;
  }


}
