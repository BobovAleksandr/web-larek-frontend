import './scss/styles.scss';
import { Api, ApiListResponse } from './components/base/api';
import { API_URL, templates, endpoints } from './utils/constants';
import { Basket, Order, ProductList, Validator } from './components/App';
import { EventEmitter } from './components/base/events';
import { ContactsFormData, IOrder, IProduct, OrderFormData } from './types';
import { Page } from './components/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CardBasket, CardCatalog, CardPreview } from './components/Card';
import { Modal } from './components/common/Modal';
import { BasketComponent } from './components/Basket';
import { ContactsForm, OrderForm } from './components/common/Form';
import { Success } from './components/Success';

const api = new Api(API_URL)

const events = new EventEmitter()
const productList = new ProductList(events);
const validator = new Validator(events)
const basket = new Basket(events);
const order = new Order(events)

const page = new Page(ensureElement('.page'), events)
const modal = new Modal(ensureElement('.modal'), events)
const basketComponent = new BasketComponent(cloneTemplate(templates.basketTemplate), events)
const cardPreview = new CardPreview(cloneTemplate(templates.cardPreviewTemplate), events);
const orderForm = new OrderForm(cloneTemplate(templates.orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(templates.contactsTemplate), events)
const success = new Success(cloneTemplate(templates.successTemplate), events)

// Запрос товаров с сервера -> Сохранение массива товаров
api.get(endpoints.productsGetUri)
  .then((products: ApiListResponse<IProduct>) => {
    productList.setCatalog(products.items);
  })
  .catch((error) => { console.error(error) });

// Сохранение массива товаров -> Рендер карточек товаров на страницу
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
  productList.selectedProduct = product;
})

// Продукт выбран -> Рендер карточки товара, открытие модального окна, изменение состояния кнопки "Купить"
events.on('product:selected', (data: { product: IProduct }) => {
  modal.content = cardPreview.render(data.product);
  modal.render();
  cardPreview.changeButtonText(basket.isProductInBasket(data.product))
})

// Нажатие кнопки добавления / удаления товара в карточке товара -> Изменение корзины
events.on('cardPreviewButton:pressed', (product: IProduct) => {
  basket.toggleBasketProduct(product)
})

// Изменение корзины (при просмотре карточки) -> Изменение состояния кнопки "Купить"
events.on('card:productChanged', (data: { isProductInBasket: boolean} ) => {
  if (productList.selectedProduct) {
    cardPreview.changeButtonText(data.isProductInBasket);
  }
})

// Имзенение корзины -> Изменение счетчика корзины
events.on('basketAmount:Changed', (data: { amount: number }) => {
  page.basketCounter = String(data.amount);
})

// Удаление товара из корзины (при просмотре корзины) -> Изменение корзины
events.on('basketCardButton:pressed', (product: IProduct) => {
  basket.toggleBasketProduct(product)
})

// Нажатие на кнопку корзины -> Инициализация корзины
events.on('basketIcon:pressed', () => {
  basket.basketInit()
})

// Открытие корзины -> Рендер элемента корзины, изменение состояния кнопки "Оформить"
events.on('basket:init', (data: { isBasketPositive: boolean }) => {
  modal.render();
  modal.content = basketComponent.render();
  basketComponent.toggleButtonState(data.isBasketPositive)
  
})

// Изменение корзины -> Ререндер корзины
events.on('basket:changed', (data: { products: IProduct[], totalBasketPrice: number, isBasketPositive: boolean }) => {
  const basketCards: HTMLElement[] = [];
  data.products.forEach((product: IProduct) => {
    const newCard = new CardBasket(cloneTemplate(templates.cardBasketTemplate), events);
    newCard.index = data.products.indexOf(product) + 1;
    basketCards.push(newCard.render(product));
  });
  basketComponent.content = basketCards;
  basketComponent.toggleButtonState(data.isBasketPositive);
  basketComponent.totalPrice = data.totalBasketPrice;
})

// Открытие модального окна -> Блокировка скролла страницы
events.on('modal:open', () => {
  page.lockPage(true);
})

// Закрытие модального окна -> Разблокировка скролла, сброс выбранного товара
events.on('modal:close', () => {
  if (productList.selectedProduct) { productList.selectedProduct = null };
  page.lockPage(false);
})

// Нажатие "Оформить" в корзине -> Перенос товаров в заказ, сброс выбранного товара
events.on('basket:submit', () => {
  order.basketData = { items: basket.products };
  if (productList.selectedProduct) { productList.selectedProduct = null };
})

// Запись данных о товаре в заказ -> Рендер формы со способом оплаты и адресом
events.on('basketData:changed', () => {
  modal.content = orderForm.render();
  modal.render();
})

// Изменения в полях формы со способом оплаты и адресом -> Вызов проверки валидации формы
events.on('orderForm:changed', (data: OrderFormData) => {
  validator.checkOrderForm(data);
})

// Проверка валидации формы со способом оплаты и адресом -> Смена текста ошибки формы, изменение состояния кнопки сабмита
events.on('orderForm:checked', (data: { status: boolean, error: string }) => {
  orderForm.valid = data.status;
  orderForm.errors = data.error;
})

// Сабмит формы со способом оплаты и адресом -> Запись данных из формы в заказ
events.on('orderForm:submit', (data: OrderFormData) => {
  order.orderData = {
    payment: data.payment,
    address: data.address
  };
})

// Изменение данных со способом оплаты и адресом -> Рендер формы с email и телефоном
events.on('orderFormData:changed', () => {
  modal.content = contactsForm.render();
  modal.render();
})

// Изменения в полях формы формы с email и телефоном -> Вызов проверки валидации формы
events.on('contactsForm:changed', (data: ContactsFormData) => {
  validator.checkContactsFormValid(data)
})

// Проверка валидации формы формы с email и телефоном -> Смена текста ошибки формы, изменение состояния кнопки сабмита
events.on('contactsForm:checked', (data: { status: boolean, error: string }) => {
  contactsForm.valid = data.status;
  contactsForm.errors = data.error;
})

// Сабмит формы с email и телефоном -> Запись данных из формы в заказ
events.on('contactsForm:submit', (data: ContactsFormData) => {
  order.contactsData = {
    email: data.email,
    phone: data.phone
  };
})

// Изменение данных email и телефона -> Отправка заказа
events.on('contactsData:changed', (order: IOrder) => {
  contactsForm.errors = 'Отправка заказа...'
  api.post(endpoints.productPostUri, order)
    .then((response: { id: string, total: number }) => events.emit('order:sent', response))
    .catch((data: { error: string }) => events.emit('order:error', data))
    .finally(() => contactsForm.errors = '')
})

// Ошибка отправки заказа -> Показ текста ошибки
events.on('order:error', (data: { error: string }) => {
  contactsForm.errors = data.error
})

// Заказ отправлен на сервер -> Рендер модального окна со статусом отправки, сброс заказа и корзины из модели
events.on('order:sent', (response: { id: string, total: number }) => {
  modal.content = success.render({ value: response.total });
  modal.render();
  basket.clearBasket()
  order.clearOrder()
})

// Нажатие кнопки модального окна статуса отправки -> Закрытие модального окна
events.on('sucсessButton:pressed', () => {
  modal.close()
})

// Сброс заказа и корзины -> Сброс счётчика корзины
events.on('basket:cleared', (data: { basketProducts: number }) => {
  page.basketCounter = String(data.basketProducts)
})