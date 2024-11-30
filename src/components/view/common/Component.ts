import { IEvents } from "../../base/events";
import { cloneTemplate } from "../../../utils/utils";

export abstract class Component {
  
  protected constructor(protected container: HTMLElement, protected events: IEvents) {
    this.events = events
  }

  setImage(element: HTMLImageElement, src: string, alt: string): void {
    if (element) {
      element.src = String(src);
      element.alt = String(alt);
    }
  }

  setDisabled(element: HTMLElement, state: boolean): void {
    if (element) {
        if (state) element.setAttribute('disabled', 'disabled');
        else element.removeAttribute('disabled');
    }
  }   

  render(data?: object): HTMLElement {
    return this.container
  }

  cloneTemplate(template: HTMLTemplateElement): HTMLElement {
    return cloneTemplate(template)
  }
}





