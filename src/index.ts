import './scss/styles.scss';
import { Api, ApiListResponse } from './components/base/api';
import { API_URL, templates, endpoints, CDN_URL } from './utils/constants';
import { AppState } from './components/AppState';
import { EventEmitter } from './components/base/events';
import { ContactsFormData, IOrder, IProduct, OrderFormData, Payment } from './types';
import { Page } from './components/Page';
import { cloneTemplate, ensureAllElements, ensureElement } from './utils/utils';
import { CardBasket, CardCatalog, CardPreview } from './components/Card';
import { Modal } from './components/common/Modal';
import { Basket } from './components/Basket';
import { ContactsForm, Form, OrderForm } from './components/common/Form';
import { Success } from './components/Sucess';

const productApi = new Api(API_URL)
const imagesApi = new Api(CDN_URL)

const events = new EventEmitter()
const app = new AppState(events)

const page = new Page(ensureElement('.page'), events)
const modal = new Modal(ensureElement('.modal'), events)
const basket = new Basket(cloneTemplate(templates.basketTemplate), events)
const cardPreview = new CardPreview(cloneTemplate(templates.cardPreviewTemplate), events);
const orderForm = new OrderForm(cloneTemplate(templates.orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(templates.contactsTemplate), events)
const sucess = new Success(cloneTemplate(templates.successTemplate), events)

productApi.get(endpoints.productUri)
  .then((products: ApiListResponse<IProduct>) => {
    app.setCatalog(products.items)
  })
  .catch((error) => {console.error(error)})

  // Изменение массива товаров -> Рендер карточек на страницу
events.on('catalog:changed', (products: IProduct[]) => {
  const cards: HTMLElement[] = [];
  products.forEach(product => {
    const card = new CardCatalog(cloneTemplate(templates.cardCatalogTemplate), events);
    cards.push(card.render(product));
  });
  page.setCatalog(cards);
})

// Открытие модального окна карточки -> Рендер карточки и открытие модального окна, присвоение выбранного товара
events.on('card:open', (product: IProduct) => {
  modal.content = cardPreview.render(product);
  modal.render();
  app.currentProduct = product;
  cardPreview.changeButtonText(app.isCurrentProductInBasket())
})

// Добавление товара в корзину -> Изменение кнопки "В корзину / Убрать из корзины"
events.on('card:buttonPressed', (product: IProduct) => {
  app.toggleBasketProduct(product);
})

// Изменение корзины -> Ререндер корзины и счетчика товаров в корзине
events.on('basket:changed', () => {
  page.basketCounter = app.basket.length;
  const basketCards: HTMLElement[] = [];
  app.basket.forEach(product => {
    const newCard = new CardBasket(cloneTemplate(templates.cardBasketTemplate), events);
    newCard.index = app.basket.indexOf(product) + 1
    basketCards.push(newCard.render(product));
  });
  cardPreview.changeButtonText(app.isCurrentProductInBasket())
  basket.toggleButtonState(app.totalBasketPrice > 0)
  basket.content = basketCards;
  basket.totalPrice = app.totalBasketPrice

})

// Открытие корзины -> Рендер корзины, изменение блока кнопки "Купить"
events.on('basket:open', () => {
  basket.toggleButtonState(app.totalBasketPrice > 0)
  modal.content = basket.render();
  modal.render();
})

// Удаление товара из корзины (в модальном окне корзины) -> Изменение списка товаров в корзине
events.on('card:deleted', (product: IProduct) => {
  app.toggleBasketProduct(product)
})

// Открытие модального окна -> Блокировка скролла
events.on('modal:open', () => {
  page.lockPage(true)
})

// Закрытие модального окна -> Разблокировка скролла, сброс выбранного товара
events.on('modal:close', () => {
  app.currentProduct = null;
  page.lockPage(false)
})

// Открытие формы со способом оплаты и адресом -> Копирование товаров в заказ
events.on('basket:submit', () => {
  app.orderProducts = app.basket
})

// Изменение товаров в заказе -> Рендер формы со способом оплаты и адресом
events.on('orderProducts:changed', () => {
  modal.content = orderForm.render()
  modal.render();
})

// Сабмит формы со способом оплаты и адресом -> Запись данныз из формы в модель
events.on('order:submit', (data: OrderFormData) => {
  app.orderFormData = data
})

// Изменение данных со способом оплаты и адресом -> Рендер формы с email и телефоном
events.on('orderData:changed', () => {
  modal.content = contactsForm.render()
  modal.render();
})

// Сабмит формы с email и телефоном -> Запись данных из формы в модель
events.on('contacts:submit', (data: ContactsFormData) => {
  app.contactsFormData = data
})

// Изменение данных с email и телефоном -> Отправка заказа
events.on('contactsData:changed', (order: IOrder) => {
  // TODO - Отправка заказа на сервер - order
})

// Заказ отправлен на сервер -> Рендер модалки с "успехом"
events.on('order:sent', () => {
  modal.content = sucess.render({value: app.totalBasketPrice})
  modal.render();
})

// Нажатие кнопки успеха -> Сброс заказа и корзины из модели
events.on('sucessButton:pressed', () => {
  app.clearData()
})

// Сброс заказа и корзины -> Закрытие модалки и сброс её контента
events.on('order:cleared', () => {
  modal.content = null
  modal.close()
})


// TODO - Пройтись форматтером