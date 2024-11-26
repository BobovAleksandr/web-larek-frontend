import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component implements IModal {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this._content = ensureElement<HTMLElement>('.modal__content', container);
    this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);

    this._closeButton.addEventListener('click', this.close.bind(this));
    this.container.addEventListener('mousedown', (evt) => {
      if (evt.target === evt.currentTarget) {
        this.close();
      }
    })
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open() {
    this.container.classList.add('modal_active');
    this.events.emit('modal:open');
    document.addEventListener('keyup', this.handleEscUp.bind(this));
  }

  close() {
    this.container.classList.remove('modal_active');
    this.content = null;
    this.events.emit('modal:close');
    document.removeEventListener('keyup', () => this.handleEscUp);
  }

  protected handleEscUp (evt: KeyboardEvent) {
    if (evt.key === 'Escape') {
      this.close();
    }
  }

  render(): HTMLElement {
    const renderedContainer = super.render();
    this.open();
    return renderedContainer
  }
}
