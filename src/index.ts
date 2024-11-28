import './scss/styles.scss';
import { Api, ApiListResponse } from './components/base/api';
import { API_URL, templates, endpoints } from './utils/constants';
import { AppState } from './components/AppState';
import { EventEmitter } from './components/base/events';
import { ContactsFormData, IOrder, IProduct, OrderFormData } from './types';
import { Page } from './components/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CardBasket, CardCatalog, CardPreview } from './components/Card';
import { Modal } from './components/common/modal';
import { Basket } from './components/Basket';
import { ContactsForm, OrderForm } from './components/common/Form';
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

// Запрос товаров с сервера -> Запись массива товаров в модель
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
  app.selectedProduct = product;
})

// Продукт выбран -> Рендер карточки, открытие модального окна, проверка кнопки "Купить"
events.on('product:selected', (data: { product: IProduct, isProductInBasket: boolean }) => {
  modal.content = cardPreview.render(data.product);
  modal.render();
  cardPreview.changeButtonText(data.isProductInBasket)
})

// Нажатие кнопки добавления / удаления товара в карточке preview -> Изменение корзины
events.on('cardPreviewButton:pressed', (product: IProduct) => {
  app.toggleBasketProduct(product)
})

// Добавление / удаление товара из корзины -> Смена кнопки "Купить" в карточке товара
events.on('card:productChanged', (data: { isProductInBasket: boolean }) => {
  cardPreview.changeButtonText(data.isProductInBasket)
})

// Удаление товара из корзины (в модальном окне корзины) -> Изменение списка товаров в корзине
events.on('basketCardButton:pressed', (product: IProduct) => {
  app.toggleBasketProduct(product)
})

// нажатие на кнопку корзины -> Инициализация корзины
events.on('basketIcon:pressed', () => {
  app.basketInit()
})

// Открытие корзины -> Рендер компонента корзины
events.on('basket:open', (data: { isBasketPositive: boolean}) => {
  modal.render();
  modal.content = basket.render();
  basket.toggleButtonState(data.isBasketPositive)
})

// Изменение корзины -> Ререндер корзины 
events.on('basket:changed', (data: {products: IProduct[], totalBasketPrice: number, isBasketPositive: boolean}) => {
  const basketCards: HTMLElement[] = [];
  data.products.forEach((product: IProduct) => {
    const newCard = new CardBasket(cloneTemplate(templates.cardBasketTemplate), events);
    newCard.index = data.products.indexOf(product) + 1;
    basketCards.push(newCard.render(product));
  });
  basket.content = basketCards;
  basket.toggleButtonState(data.isBasketPositive);
  basket.totalPrice = data.totalBasketPrice;
})

// Изменение корзины -> Смена счетчика товаров в корзине
events.on('basket:amountChanged', (data: {value: string}) => {
  page.basketCounter = data.value;
})

// Открытие модального окна -> Блокировка скролла
events.on('modal:open', () => {
  page.lockPage(true);
})

// Закрытие модального окна -> Разблокировка скролла, сброс выбранного товара
events.on('modal:close', () => {
  if (app.selectedProduct) { app.selectedProduct = null };
  page.lockPage(false);
})

// Нажатие "Оформить" в корзине -> Копирование товаров и суммы товаров в заказ, сброс выбранного элемента
events.on('basket:submit', () => {
  app.orderProductsData = app.basketProducts;
  app.selectedProduct = null;
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

// Соединить сабмиты
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

// // тестовый метод
// events.on('form:submit', <T extends object>(data: T) => {
//   app.contactsFormData = data
// })

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

// Сброс заказа и корзины -> Закрытие модалки, сброс её контента, сброс счётчика
events.on('allData:cleared', (data: { basketProducts: number }) => {
  page.basketCounter = String(data.basketProducts)
  modal.close()
})