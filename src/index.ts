import './scss/styles.scss';
import { Api } from './components/base/api';
import { API_URL, templates, settings } from './utils/constants';
import { AppApi } from './components/base/appApi';
import { Basket, IProduct, IProductList, ProductList } from './types';
import { ApiListResponse } from './components/base/api';
import { CardComponent } from './components/CardComponent';
import { EventEmitter } from './components/base/events';
import { ModalComponent } from './components/base/ModalComponent';
import { BasketIcon } from './components/BasketIcon';
import { BasketComponent } from './components/BasketComponent';

const events = new EventEmitter()

const api = new Api(API_URL)
const appApi = new AppApi(api)

const basket = new Basket()

const modal = new ModalComponent(templates.modal, events)
const basketIcon = new BasketIcon(templates.basketIcon, events)

const productList = new ProductList(events)

// Загрузить товары в productList 
appApi.getData(settings.productUri)
  .then((response: ApiListResponse<IProduct>) => {
    productList.products = response.items
  })
  .catch(error => console.log(error))


// Отрисовать карточки на странице
events.on('productList:changed', (products: IProduct[]) => {
  products.forEach(product => {
    const newCard = new CardComponent(templates.cardCatalogTemplate, events, product).render()
    templates.gallery.append(newCard)
  })
})

// Открытие карточки товара
events.on('card:open', (card: CardComponent) => {
  modal.render(new CardComponent(templates.cardPreviewTemplate, events, card.product).render());
  modal.open();
})


// // Добавление товара в корзину
// // Событие возникает при нажатии на кнопку "В корзину" или она же "Убрать из корзины" или Крестик карточки товара в корзине
// events.on('card:changeBasket', (card: CardComponent) => {
//   // Получаем товар по id
//   appApi.getCardById(settings.productUri, card.id)
//     .then((product: IProduct) => {
//       // Корзина принимает товар и проверяет его наличие в своем массиве товаров. Если есть - удаляет, если нет - добавляет.
//       basket.changeProducts(product)
//       // Меняется текст карточки: "В корзину" / "Убрать из корзины" в зависимости от наличия товара в массиве корзины
//       card.changeButtonText(basket.products)
//       // Меняется число товаров на иконке корзины
//       basketIcon.render(basket.products.length)
//       // Если компоненет карты является элементом темплейта card-basket (то есть это карточка формата для корзины). Внутри метода происходит проверка наличия класса card_compact у компонента карточки
//       if (card.isBasketCard) {
//         // Карточка удаляется из DOM-дерева
//         card.deleteCard()
//         // Модальное окно рендерит новую корзину внутри себя, принимая компонент корзины (с измененным массивом товаров)
//         modal.render(
//           new BasketComponent(elements.basketTemplate, events)
//             .render(basket, elements.cardBasketTemplate)
//         )
//       }
//     })
// })

// // Открытие корзины
// // Событие возникает при нажатии на икноку корзины
// events.on('basket:open', () => {
//   // Создаетя новый DOM-элемент корзины
//   const newBasketComponent = new BasketComponent(elements.basketTemplate, events)
//   // В модальном окне рендерится новая корзина, принимая компонент корзины с массивом товаров
//   modal.render(
//     newBasketComponent.render(basket, elements.cardBasketTemplate)
//   )
//   // Открывается модальное окно
//   modal.open()
// })







