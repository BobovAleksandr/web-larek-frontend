import { IEvents } from "./events";
import { cloneTemplate } from "../../utils/utils";

export abstract class Component {
  
  protected constructor(protected container: HTMLElement, protected events: IEvents) {
    this.events = events
  }

  toggleClass(element: HTMLElement, className: string, force?: boolean) {
    element.classList.toggle(className, force);
  }

  protected setText(element: HTMLElement, value: unknown) {
    if (element) {
        element.textContent = String(value);
    }
  }

  setDisabled(element: HTMLElement, state: boolean) {
    if (element) {
        if (state) element.setAttribute('disabled', 'disabled');
        else element.removeAttribute('disabled');
    }
  }   

  render(): HTMLElement {
    return this.container
  }
}





