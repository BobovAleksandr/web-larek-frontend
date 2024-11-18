import { IProduct } from "../types";
import { IEvents } from "./base/events";
import { Card } from "./Card"
import { Component } from "./base/baseComponent";

export class Basket extends Component {
  protected productListContainer: HTMLElement;
  protected buttonBuy: HTMLButtonElement;
  protected price: HTMLElement;
  protected title: HTMLElement;
  protected basketProducts: Card[];

  constructor(template: HTMLTemplateElement, events: IEvents) {
    super(template, events)
    this.title = this.element.querySelector('.modal__title')
    this.productListContainer = this.element.querySelector('.basket__list')
    this.buttonBuy = this.element.querySelector('.basket__button')
    this.price = this.element.querySelector('.basket__price')
    this.basketProducts = []

    this.buttonBuy.addEventListener('click', () => {
      this.events.emit('basket:submit', { products: this.basketProducts })
    })
  }
   
  render(products: IProduct[], template: HTMLTemplateElement) {
    products.forEach(product => {
      const newBasketCard = new Card(template, this.events)
      newBasketCard.render(product)
      this.basketProducts.push(newBasketCard)
    })
    return this.basketProducts
  }
}


