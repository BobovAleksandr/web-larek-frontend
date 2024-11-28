import './scss/styles.scss';
import { Api, ApiListResponse } from './components/base/api';
import { API_URL, templates, endpoints, CDN_URL } from './utils/constants';
import { AppState } from './components/appState';
import { EventEmitter } from './components/base/events';
import { ContactsFormData, IOrder, IProduct, OrderFormData } from './types';
import { Page } from './components/page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CardBasket, CardCatalog, CardPreview } from './components/card';
import { Modal } from './components/common/modal';
import { Basket } from './components/basket';
import { ContactsForm, OrderForm } from './components/common/form';
import { Success } from './components/sucess';

const api = new Api(API_URL)

const events = new EventEmitter()
const app = new AppState(events)

const page = new Page(ensureElement('.page'), events)
const modal = new Modal(ensureElement('.modal'), events)
const basket = new Basket(cloneTemplate(templates.basketTemplate), events)
const cardPreview = new CardPreview(cloneTemplate(templates.cardPreviewTemplate), events);
const orderForm = new OrderForm(cloneTemplate(templates.orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(templates.contactsTemplate), events)
const success = new Success(cloneTemplate(templates.successTemplate), events)

// Запрос товаров с сервера -> запись массива товаров в модель
api.get(endpoints.productsGetUri)
  .then((products: ApiListResponse<IProduct>) => {
    app.setCatalog(products.items);
  })
  .catch((error) => {console.error(error)});

// Изменение массива товаров -> Рендер карточек на страницу
events.on('catalog:changed', (products: IProduct[]) => {
  const cards: HTMLElement[] = [];
  products.forEach(product => {
    const card = new CardCatalog(cloneTemplate(templates.cardCatalogTemplate), events);
    cards.push(card.render(product));
  });
  page.setCatalog(cards);
})

// Нажатие на карточку в каталоге -> Выбор текущего товара
events.on('catalogCard:pressed', (product: IProduct) => {
  app.currentProduct = product;
})

// Продукт выбран -> рендер карточки, открытие модального окна
events.on('product:selected', (data: { product: IProduct, isProductInBasket: boolean }) => {
  modal.content = cardPreview.render(data.product);
  modal.render();
  cardPreview.changeButtonText(data.isProductInBasket) // TODO переписать
})

// Нажатие кнопки добавления товара в корзину -> Изменение корзины, выбор текущего товара
events.on('card:buttonPressed', (product: IProduct) => {
  app.addBasketProduct(product);
})

// TODO изменение корзины - это не перерисовка, поправить
// Изменение корзины -> Ререндер корзины и счетчика товаров в корзине
events.on('basket:changed', () => {
  
  const basketCards: HTMLElement[] = [];
  app.basketProducts.forEach(product => {
    const newCard = new CardBasket(cloneTemplate(templates.cardBasketTemplate), events);
    newCard.index = app.basketProducts.indexOf(product) + 1
    basketCards.push(newCard.render(product));
  });
  // TODO нижнее убрать?
  // cardPreview.changeButtonText(app.isCurrentProductInBasket())
  // basket.toggleButtonState(app.totalBasketPrice > 0)
  basket.content = basketCards;
  basket.totalPrice = app.totalBasketPrice
})

// Товар добавлен в корзину -> Изменение счётчка корзины и если карточка открыта, смена кнопки
events.on('basket:productAdded', (data: {basket: IProduct[], isCurrent: boolean}) => {
  page.basketCounter = data.basket.length;
  cardPreview.changeButtonText(data.isCurrent)
})



// Может ли одно событие вызывать другое?
// Нажата кнопка корзины -> получение суммы корзины
events.on('basketIcon:pressed', () => {
  const isBasketPositive: boolean = app.totalBasketPrice > 0
  events.emit('basket:open', { value: isBasketPositive })
})

// Открытие корзины -> Рендер корзины, изменение блока кнопки "Купить"
events.on('basket:open', (data: {value: boolean}) => {
  basket.toggleButtonState(data.value)
  modal.content = basket.render();
  modal.render();
})

// Удаление товара из корзины (в модальном окне корзины) -> Изменение списка товаров в корзине
events.on('card:deleted', (product: IProduct) => {
  app.deleteBasketProduct(product)
})

// Открытие модального окна -> Блокировка скролла
events.on('modal:open', () => {
  page.lockPage(true)
})

// Закрытие модального окна -> Разблокировка скролла, сброс выбранного товара
events.on('modal:close', () => {
  app.currentProduct = null;  // TODO переместить сброс текущего продукта
  page.lockPage(false)
})

// Нажатие "Оформить" в корзине -> Копирование товаров и суммы товаров в заказ
events.on('basket:submit', () => {
  app.orderProductsData = app.basketProducts
})

// Изменение товаров в заказе -> Рендер формы со способом оплаты и адресом
events.on('orderProductsData:changed', () => {
  modal.content = orderForm.render()
  modal.render();
})

// Изменения в полях формы со способом оплаты и адресом -> вызов проверки валидации формы
events.on('orderForm:changed', (data: OrderFormData) => {
  app.checkOrderFormValid(data)
})

// Проверка валидации формы со способом оплаты и адресом -> смена текста ошибки формы, смена блокировки кнопки сабмита
events.on('orderForm:checked', (data: { status: boolean, error: string }) => {
  orderForm.valid = data.status
  orderForm.errors = data.error
})

// Сабмит формы со способом оплаты и адресом -> Запись данных из формы в модель
events.on('orderForm:submit', (data: OrderFormData) => {
  app.orderFormData = data
})

// Изменение данных со способом оплаты и адресом -> Рендер формы с email и телефоном
events.on('orderData:changed', () => {
  modal.content = contactsForm.render()
  modal.render();
})

// Изменения в полях формы формы с email и телефоном -> вызов проверки валидации формы
events.on('contactsForm:changed', (data: ContactsFormData) => {
  app.checkContactsFormValid(data)
})

// Проверка валидации формы формы с email и телефоном -> Смена текста ошибки формы, смена блок кнопки сабмита
events.on('contactsForm:checked', (data: { status: boolean, error: string }) => {
  contactsForm.valid = data.status
  contactsForm.errors = data.error
})

// TODO сабмиты объеденить
// Сабмит формы формы с email и телефоном -> Запись данных из формы в модель
events.on('contactsForm:submit', (data: ContactsFormData) => {
  app.contactsFormData = data
})

// Изменение данных email и телефона -> Отправка заказа
events.on('contactsData:changed', (order: IOrder) => {
  api.post(endpoints.productPostUri, order)
    .then((response: { id: string, total: number }) => events.emit('order:sent', response))
    .catch((data: { error: string }) => events.emit('order:error', data))
})

// Ошибка отправки заказа -> Показ текста ошибки
events.on('order:error', (data: { error: string }) => {
  contactsForm.errors = data.error
})

// Заказ отправлен на сервер -> Рендер модалки с "успехом"
events.on('order:sent', (response: { id: string, total: number }) => {
  modal.content = success.render({ value: response.total })
  modal.render();
})

// Нажатие кнопки успеха -> Сброс заказа и корзины из модели
events.on('sucсessButton:pressed', () => {
  app.clearAllData()
})

// Сброс заказа и корзины -> Закрытие модалки и сброс её контента
events.on('allData:cleared', () => {
  modal.content = null
  modal.close()
})