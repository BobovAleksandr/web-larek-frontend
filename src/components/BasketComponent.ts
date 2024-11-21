import { IBasket, IProduct } from "../types";
import { IEvents } from "./base/events";
import { CardComponent } from "./CardComponent"
import { BaseComponent } from "./base/baseComponent";
import { settings } from "../utils/constants";

export class BasketComponent extends BaseComponent {
  protected productListContainer: HTMLElement;
  protected buttonBuy: HTMLButtonElement;
  protected price: HTMLElement;
  protected title: HTMLElement;
  protected basketProducts: CardComponent[];

  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template, events)
    this.title = this.element.querySelector('.modal__title')
    this.productListContainer = this.element.querySelector('.basket__list')
    this.buttonBuy = this.element.querySelector('.basket__button')
    this.buttonBuy.disabled = true;
    this.price = this.element.querySelector('.basket__price')
    this.basketProducts = []

    this.buttonBuy.addEventListener('click', () => {
      this.events.emit('basket:submit', { products: this.basketProducts })
    })
  }
  
  render(basket: IBasket, template: HTMLTemplateElement) {
    basket.products.forEach(product => {
      const newBasketCard = new CardComponent(template, this.events).render(product)
      this.productListContainer.append(newBasketCard)
      this.price.textContent = basket.totalPrice + settings.currency
      if (basket.totalPrice !== '0') { this.buttonBuy.disabled = false }
    })
    return this.element
  }
}


