import { IEvents } from "./events";
import { cloneTemplate } from "../../utils/utils";

export abstract class BaseComponent {
  protected element: HTMLElement | HTMLFormElement;
  protected events: IEvents;
  
  constructor(template: HTMLTemplateElement, events: IEvents) {
    this.events = events
    this.element = cloneTemplate(template)
  }
}