import './scss/styles.scss';
import { Api, ApiListResponse } from './components/base/api';
import { API_URL, templates, endpoints, events } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { ProductList } from './components/model/ProductList';
import { Validator } from './components/model/Validator';
import { Basket } from './components/model/Basket';
import { Order } from './components/model/Order';
import { Page } from './components/view/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/view/common/Modal';
import { BasketElement } from './components/view/Basket';
import { ContactsForm, OrderForm } from './components/view/common/Form';
import { Success } from './components/view/Success';
import { ContactsFormData, IOrder, IProduct, OrderFormData } from './types';
import { CardPreview } from './components/view/CardPreview';
import { CardCatalog } from './components/view/CardCatalog';
import { CardBasket } from './components/view/CardBasket';


const api = new Api(API_URL)

const emitterEvents = new EventEmitter()
const productList = new ProductList(emitterEvents);
const validator = new Validator(emitterEvents)
const basket = new Basket(emitterEvents);
const order = new Order(emitterEvents)

const page = new Page(ensureElement('.page'), emitterEvents)
const modal = new Modal(ensureElement('.modal'), emitterEvents)
const basketComponent = new BasketElement(cloneTemplate(templates.basketTemplate), emitterEvents)
const cardPreview = new CardPreview(cloneTemplate(templates.cardPreviewTemplate), emitterEvents);
const orderForm = new OrderForm(cloneTemplate(templates.orderTemplate), emitterEvents);
const contactsForm = new ContactsForm(cloneTemplate(templates.contactsTemplate), emitterEvents)
const success = new Success(cloneTemplate(templates.successTemplate), emitterEvents)

// Запрос товаров с сервера -> Сохранение массива товаров
api.get(endpoints.productsGetUri)
  .then((products: ApiListResponse<IProduct>) => {
    productList.setCatalog(products.items);
  })
  .catch((error) => { console.error(error) });

// Сохранение массива товаров -> Рендер карточек товаров на страницу
emitterEvents.on(events.catalogChanged, (products: IProduct[]) => {
  const cards: HTMLElement[] = [];
  products.forEach(product => {
    const card = new CardCatalog(cloneTemplate(templates.cardCatalogTemplate), emitterEvents);
    cards.push(card.render(product));
  });
  page.setCatalog(cards);
})

// Нажатие на карточку в каталоге -> Выбор текущего товара
emitterEvents.on(events.catalogPressed, (product: IProduct) => {
  productList.selectedProduct = product;
})

// Продукт выбран -> Рендер карточки товара, открытие модального окна, изменение состояния кнопки "Купить"
emitterEvents.on(events.productSelected, (data: { product: IProduct }) => {
  modal.content = cardPreview.render(data.product);
  modal.render();
  cardPreview.changeButtonText(basket.isProductInBasket(data.product))
})

// Нажатие кнопки добавления / удаления товара в карточке товара -> Изменение корзины
emitterEvents.on(events.cardPreviewButtonPressed, (product: IProduct) => {
  basket.toggleBasketProduct(product)
})

// Изменение корзины (при просмотре карточки) -> Изменение состояния кнопки "Купить"
emitterEvents.on(events.cardProductChanged, (data: { isProductInBasket: boolean} ) => {
  if (productList.selectedProduct) {
    cardPreview.changeButtonText(data.isProductInBasket);
  }
})

// Имзенение корзины -> Изменение счетчика корзины
emitterEvents.on(events.basketAmountChanged, (data: { amount: number }) => {
  page.basketCounter = String(data.amount);
})

// Удаление товара из корзины (при просмотре корзины) -> Изменение корзины
emitterEvents.on(events.basketCardButtonPressed, (product: IProduct) => {
  basket.toggleBasketProduct(product)
})

// Нажатие на кнопку корзины -> Инициализация корзины
emitterEvents.on(events.basketIconPressed, () => {
  basket.basketInit()
})

// Открытие корзины -> Рендер элемента корзины, изменение состояния кнопки "Оформить"
emitterEvents.on(events.basketInit, (data: { isBasketPositive: boolean }) => {
  modal.render();
  modal.content = basketComponent.render();
  basketComponent.toggleButtonState(data.isBasketPositive)
  
})

// Изменение корзины -> Ререндер корзины
emitterEvents.on(events.basketChanged, (data: { products: IProduct[], totalBasketPrice: number, isBasketPositive: boolean }) => {
  const basketCards: HTMLElement[] = [];
  data.products.forEach((product: IProduct) => {
    const newCard = new CardBasket(cloneTemplate(templates.cardBasketTemplate), emitterEvents);
    newCard.index = data.products.indexOf(product) + 1;
    basketCards.push(newCard.render(product));
  });
  basketComponent.content = basketCards;
  basketComponent.toggleButtonState(data.isBasketPositive);
  basketComponent.totalPrice = data.totalBasketPrice;
})

// Открытие модального окна -> Блокировка скролла страницы
emitterEvents.on(events.modalOpen, () => {
  page.lockPage(true);
})

// Закрытие модального окна -> Разблокировка скролла, сброс выбранного товара
emitterEvents.on(events.modalClose, () => {
  if (productList.selectedProduct) { productList.selectedProduct = null };
  page.lockPage(false);
})

// Нажатие "Оформить" в корзине -> Перенос товаров в заказ, сброс выбранного товара
emitterEvents.on(events.basketSubmit, () => {
  order.basketData = { items: basket.products };
  if (productList.selectedProduct) { productList.selectedProduct = null };
})

// Запись данных о товаре в заказ -> Рендер формы со способом оплаты и адресом
emitterEvents.on(events.baskeetDataChanged, () => {
  modal.content = orderForm.render();
  modal.render();
})

// Изменения в полях формы со способом оплаты и адресом -> Вызов проверки валидации формы
emitterEvents.on(events.orderFormChanged, (data: OrderFormData) => {
  validator.checkOrderForm(data);
})

// Проверка валидации формы со способом оплаты и адресом -> Смена текста ошибки формы, изменение состояния кнопки сабмита
emitterEvents.on(events.orderFormChecked, (data: { status: boolean, error: string }) => {
  orderForm.valid = data.status;
  orderForm.errors = data.error;
})

// Сабмит формы со способом оплаты и адресом -> Запись данных из формы в заказ
emitterEvents.on(events.orderFormSubmit, (data: OrderFormData) => {
  order.orderData = {
    payment: data.payment,
    address: data.address
  };
})

// Изменение данных со способом оплаты и адресом -> Рендер формы с email и телефоном
emitterEvents.on(events.orderFormDataChanged, () => {
  modal.content = contactsForm.render();
  modal.render();
})

// Изменения в полях формы формы с email и телефоном -> Вызов проверки валидации формы
emitterEvents.on(events.contactsFormChanged, (data: ContactsFormData) => {
  validator.checkContactsFormValid(data)
})

// Проверка валидации формы формы с email и телефоном -> Смена текста ошибки формы, изменение состояния кнопки сабмита
emitterEvents.on(events.contactsFormChecked, (data: { status: boolean, error: string }) => {
  contactsForm.valid = data.status;
  contactsForm.errors = data.error;
})

// Сабмит формы с email и телефоном -> Запись данных из формы в заказ
emitterEvents.on(events.contactsFormSubmit, (data: ContactsFormData) => {
  order.contactsData = {
    email: data.email,
    phone: data.phone
  };
})

// Изменение данных email и телефона -> Отправка заказа
emitterEvents.on(events.contactsFormDataChanged, (order: IOrder) => {
  contactsForm.errors = 'Отправка заказа...'
  api.post(endpoints.productPostUri, order)
    .then((response: { id: string, total: number }) => emitterEvents.emit('order:sent', response))
    .catch((data: { error: string }) => emitterEvents.emit('order:error', data))
    .finally(() => contactsForm.errors = '')
})

// Ошибка отправки заказа -> Показ текста ошибки
emitterEvents.on(events.orderError, (data: { error: string }) => {
  contactsForm.errors = data.error
})

// Заказ отправлен на сервер -> Рендер модального окна со статусом отправки, сброс заказа и корзины из модели
emitterEvents.on(events.orderSent, (response: { id: string, total: number }) => {
  modal.content = success.render({ value: response.total });
  modal.render();
  basket.clearBasket()
  order.clearOrder()
})

// Нажатие кнопки модального окна статуса отправки -> Закрытие модального окна
emitterEvents.on(events.successButtonPressed, () => {
  modal.close()
})

// Сброс заказа и корзины -> Сброс счётчика корзины
emitterEvents.on(events.basketCleared, (data: { basketProducts: number }) => {
  page.basketCounter = String(data.basketProducts)
})