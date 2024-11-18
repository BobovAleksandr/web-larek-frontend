import { IEvents } from "./events";

export class Modal {
  protected modal: HTMLDivElement;
  protected modalContent: HTMLDivElement;
  protected buttonClose: HTMLButtonElement;
  protected events: IEvents;

  constructor(modal: HTMLDivElement, events: IEvents) {
    this.modal = modal;
    this.events = events;
    this.modalContent = this.modal.querySelector('.modal__container');
    this.buttonClose = this.modal.querySelector('.modal__close');
    this.buttonClose.addEventListener('click', this.close.bind(this))
    this.modal.addEventListener('mousedown', (evt) => {
      if (evt.target === evt.currentTarget) {
        this.close();
      }
    })
  }

  open() {
    this.modal.classList.add('modal_active');
    document.addEventListener('keyup', this.handleEscUp);
  }

  close() {
    this.modal.classList.remove('modal_active');
    document.removeEventListener('keyup', this.handleEscUp);
  }
  
  handleEscUp (evt: KeyboardEvent) {
    if (evt.key === 'Escape') {
      this.close();
    }
  }
}