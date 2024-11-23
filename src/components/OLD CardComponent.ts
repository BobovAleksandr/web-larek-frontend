// import { IEvents } from "./base/events";
// import { Component } from "./base/Component";
// import { settings, CategorySelectors } from "../utils/constants";

// export class CardComponent extends Component {
//   protected container: HTMLElement | HTMLButtonElement;
//   protected title: HTMLElement;
//   protected category: HTMLSpanElement | undefined;
//   protected description: HTMLParagraphElement | undefined;
//   protected price: HTMLSpanElement;
//   protected image: HTMLImageElement | undefined;
//   protected button: HTMLButtonElement | undefined;
//   protected basketIndex: HTMLSpanElement | undefined;
//   protected _product: IProduct;
//   protected currency: string;

//   constructor(template: HTMLTemplateElement, events: IEvents, product: IProduct) {
//     super(template, events);
//     this._product = product;
//     this.currency = settings.currency;
//     this.title = this.container.querySelector('.card__title');
//     this.button = this.container.querySelector('.card__button');
//     this.category = this.container.querySelector('.card__category');
//     this.description = this.container.querySelector('.card__text');
//     this.basketIndex = this.container.querySelector('.basket__item-index')
//     this.price = this.container.querySelector('.card__price');
//     this.image = this.container.querySelector('.card__image');
    
//     if (this.container instanceof HTMLButtonElement) {
//       this.container.addEventListener('click', () => {
//         this.events.emit('card:open', this);
//       })
//     }
    
//     if (this.button) {
//       this.button.addEventListener('click', () => {
//         this.events.emit('card:changeBasket', this);
//       })
//     }
//   }

//   get product() {
//     return this._product
//   }

//   get isBasketCard():boolean {
//     return this.container.classList.contains('card_compact')
//   }

//   // changeButtonText(basketProducts: IProduct[]) {
//   //   this.button.textContent = basketProducts.some(product => product.id === this.id) ? 'Убрать из корзины' : 'В корзину'
//   // }

//   deleteCard() {
//     this.container.remove();
//     this.container = null;
//   }

//   render(): HTMLElement {
//     this.price.textContent = (this.product.price ?? '0') + this.currency;
//     this.title.textContent = this.product.title;
//     // if (this.basketIndex) { this.basketIndex.textContent = product. }
//     if (this.category) { this.category.textContent = this.product.category };
//     if (this.category) { this.category.classList.add(`card__category_${CategorySelectors[this.product.category]}`) }
//     if (this.description) { this.description.textContent = this.product.description }
//     if (this.image) {
//       // this.image.src = `${cardData.image}`;
//       this.image.alt = this.product.title;
//     }
//     if (this.button && this.product.price === null) { this.button.disabled = true }
//     return this.container
//   }
// }

// // TODO - загрузка картинок - https://larek-api.nomoreparties.co/content/weblarek/Shell.svg

// // TODO поправить описание класса
