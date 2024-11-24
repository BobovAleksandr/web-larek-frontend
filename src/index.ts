import './scss/styles.scss';
import { Api, ApiListResponse } from './components/base/api';
import { API_URL, templates, endpoints, CDN_URL } from './utils/constants';
import { AppState } from './components/AppState';
import { EventEmitter } from './components/base/events';
import { IProduct, Payment } from './types';
import { Page } from './components/Page';
import { cloneTemplate, ensureAllElements, ensureElement } from './utils/utils';
import { CardBasket, CardCatalog, CardPreview } from './components/Card';
import { Modal } from './components/common/Modal';
import { Basket } from './components/Basket';
import { OrderForm } from './components/common/Form';

const productApi = new Api(API_URL)
const imagesApi = new Api(CDN_URL)

const events = new EventEmitter()
const app = new AppState(events)

const page = new Page(ensureElement('.page'), events)
const modal = new Modal(ensureElement('.modal'), events)
const basket = new Basket(cloneTemplate(templates.basketTemplate), events)
const cardPreview = new CardPreview(cloneTemplate(templates.cardPreviewTemplate), events);
const orderForm = new OrderForm(cloneTemplate(templates.orderTemplate), events);

productApi.get(endpoints.productUri)
  .then((products: ApiListResponse<IProduct>) => {
    app.setCatalog(products.items)
  })
  .catch((error) => {console.error(error)})

  // Рендер карточек в каталог
events.on('catalog:changed', (products: IProduct[]) => {
  const cards: HTMLElement[] = [];
  products.forEach(product => {
    const card = new CardCatalog(cloneTemplate(templates.cardCatalogTemplate), events);
    cards.push(card.render(product));
  });
  page.setCatalog(cards);
})

// Открытие модального окна карточки
events.on('card:open', (product: IProduct) => {
  modal.content = cardPreview.render(product);
  modal.render();
  app.currentProduct = product;
  cardPreview.changeButtonText(app.isCurrentProductInBasket())
})

// Добавление товара в корзину
// TODO - смена надписи на кнопке "В корзину"
events.on('card:buttonPressed', (product: IProduct) => {
  app.toggleBasketProduct(product);
})

// Изменение корзины
events.on('basket:changed', () => {
  page.basketCounter = app.basket.length;
  const basketCards: HTMLElement[] = [];
  app.basket.forEach(product => {
    const newCard = new CardBasket(cloneTemplate(templates.cardBasketTemplate), events);
    newCard.index = app.basket.indexOf(product) + 1
    basketCards.push(newCard.render(product));
  });
  cardPreview.changeButtonText(app.isCurrentProductInBasket())
  basket.toggleButtonState(app.basketTotal > 0)
  basket.content = basketCards;
  basket.totalPrice = app.basketTotal

})

// Открытие корзины
events.on('basket:open', () => {
  basket.toggleButtonState(app.basketTotal > 0)
  modal.content = basket.render();
  modal.render();
})

// Удаление товара из корзины (в модальном окне корзины)
events.on('card:deleted', (product: IProduct) => {
  app.toggleBasketProduct(product)
})

// Закрытие модального окна
events.on('modal:close', () => {
  app.currentProduct = null;
})

// Открытие формы со способом оплаты и адресом
events.on('basket:submit', () => {
  modal.content = orderForm.render()
  modal.render();
})

// Выбор оплаты
events.on('paymentButton:pressed', (data: Record<string, Payment>) => {
  app.orderPayment = data.payment
})

// Изменение актвной кнопки оплаты
events.on('payment:changed', (data: Record<string, Payment>) => {
  orderForm.resetButtons()
  orderForm.setButtonActive(data.payment)
})


// TODO - закреп страницы при открытии модалки