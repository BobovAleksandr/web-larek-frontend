import './scss/styles.scss';
import { Api, ApiListResponse } from './components/base/api';
import { API_URL, templates, settings } from './utils/constants';
import { AppApi } from './components/base/appApi';
import { AppState } from './components/AppState';
import { EventEmitter } from './components/base/events';
import { IProduct } from './types';
import { Page } from './components/Page';
import { cloneTemplate, ensureAllElements, ensureElement } from './utils/utils';
import { CardBasket, CardCatalog, CardPreview } from './components/Card';
import { Modal } from './components/common/Modal';
import { Basket } from './components/Basket';

const api = new Api(API_URL)
const appApi = new AppApi(api)

const events = new EventEmitter()
const app = new AppState(events)

const page = new Page(ensureElement('.page'), events)
const modal = new Modal(ensureElement('.modal'), events)
const basket = new Basket(cloneTemplate(templates.basketTemplate), events)


// Загрузка товаров в app
appApi.getData(settings.productUri)
  .then((products: ApiListResponse<IProduct>) => {
    app.setCatalog(products.items)
  })
  .catch((error) => {console.error(error)})

// Рендер карточек в каталог
events.on('catalog:changed', (products: IProduct[]) => {
  const cards: HTMLElement[] = [];
  products.forEach(product => {
    const card = new CardCatalog(cloneTemplate(templates.cardCatalogTemplate), events, product);
    cards.push(card.render());
  });
  page.setCatalog(cards);
})

// Открытие модального окна карточки
events.on('card:open', (product: IProduct) => {
  const card = new CardPreview(cloneTemplate(templates.cardPreviewTemplate), events, product);
  modal.content = card.render();
  modal.render();
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
    const newCard = new CardBasket(cloneTemplate(templates.cardBasketTemplate), events, product);
    newCard.index = app.basket.indexOf(product) + 1
    basketCards.push(newCard.render());
  });
  basket.content = basketCards;
  const basketTotal = app.getBasketTotal()
  basket.totalPrice = basketTotal
  basket.checkButtonState(basketTotal > 0)
})

// Открытие корзины
events.on('basket:open', () => {
  modal.content = basket.render();
  modal.render();
})

// Удаление товара из корзины (в модальном окне корзины)
events.on('card:deleted', (product: IProduct) => {
  app.toggleBasketProduct(product)
})
