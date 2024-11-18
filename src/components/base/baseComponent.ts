import { IEvents } from "./events";
import { cloneTemplate } from "../../utils/utils";

export abstract class Component {
  protected element: HTMLElement;
  protected events: IEvents;
  
  constructor(template: HTMLTemplateElement, events: IEvents) {
    this.events = events
    this.element = cloneTemplate(template)
  }
}