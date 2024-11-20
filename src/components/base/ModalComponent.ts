import { IEvents } from "./events";

export class ModalComponent {
  protected modal: HTMLElement;
  protected buttonClose: HTMLButtonElement;
  protected events: IEvents;
  modalContent: HTMLElement | null;
  
  constructor(modal: HTMLElement, events: IEvents) {
    this.modal = modal;
    this.events = events;
    this.modalContent = this.modal.querySelector('.modal__content');
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
    document.addEventListener('keyup', this.handleEscUp.bind(this));
  }

  close() {
    this.events.emit('modal:close', { modal: this })
    this.modal.classList.remove('modal_active');
    console.log('close')
    document.removeEventListener('keyup', () => this.handleEscUp);
  }
  
  protected handleEscUp (evt: KeyboardEvent) {
    if (evt.key === 'Escape') {
      this.close();
      console.log(this)
    }
  }

  render() {
    return this.modal
  }
}