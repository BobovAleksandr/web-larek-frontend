import { IEvents } from "./events";

export class ModalComponent {
  protected modal: HTMLDivElement;
  protected buttonClose: HTMLButtonElement;
  protected events: IEvents;
  modalContent: HTMLDivElement;
  
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
    this.events.emit('modal:open', { modal: this })
    this.modal.classList.add('modal_active');
    document.addEventListener('keyup', this.handleEscUp);
  }

  close() {
    this.events.emit('modal:close', { modal: this })
    this.modal.classList.remove('modal_active');
    document.removeEventListener('keyup', this.handleEscUp);
  }
  
  protected handleEscUp (evt: KeyboardEvent) {
    if (evt.key === 'Escape') {
      this.close();
    }
  }

  render() {
    return this.modal
  }
}