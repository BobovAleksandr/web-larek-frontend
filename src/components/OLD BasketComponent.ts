// import { IBasket, IProduct } from "../types";
// import { IEvents } from "./base/events";
// import { CardComponent } from "./OLD CardComponent"
// import { Component } from "./base/Component";
// import { settings } from "../utils/constants";

// export class BasketComponent extends Component {
//   protected productListContainer: HTMLElement;
//   protected buttonBuy: HTMLButtonElement;
//   protected price: HTMLElement;
//   protected title: HTMLElement;
//   protected basketProducts: CardComponent[];

//   constructor(template: HTMLTemplateElement, events: IEvents) {
//     super(template, events)
//     this.title = this.container.querySelector('.modal__title')
//     this.productListContainer = this.container.querySelector('.basket__list')
//     this.buttonBuy = this.container.querySelector('.basket__button')
//     this.buttonBuy.disabled = true;
//     this.price = this.container.querySelector('.basket__price')
//     this.basketProducts = []

//     this.buttonBuy.addEventListener('click', () => {
//       this.events.emit('basket:submit', { products: this.basketProducts })
//     })
//   }
  
//   render(basket: IBasket, template: HTMLTemplateElement) {
//     basket.products.forEach(product => {
//       const newBasketCard = new CardComponent(template, this.events, product).render()
//       this.productListContainer.append(newBasketCard)
//       this.price.textContent = basket.totalPrice + settings.currency
//       if (basket.totalPrice !== '0') { this.buttonBuy.disabled = false }
//     })
//     return this.container
//   }
// }


