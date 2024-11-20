import './scss/styles.scss';
import { Api } from './components/base/api';
import { API_URL, elements, settings } from './utils/constants';
import { AppApi } from './components/base/appApi';
import { IProduct, IProductList, ProductList } from './types';
import { ApiListResponse } from './components/base/api';
import { CardsContainer } from './components/CardsContainer';
import { CardComponent } from './components/CardComponent';
import { EventEmitter } from './components/base/events';
import { ModalComponent } from './components/base/ModalComponent';

const events = new EventEmitter()

const cardsContainer = new CardsContainer(elements.gallery)
const modal = new ModalComponent(elements.modal, events)
const basketButton = elements.basketButton

const api = new Api(API_URL)
const appApi = new AppApi(api)

appApi.getData(settings.productUri)
  .then((response: ApiListResponse<IProduct>) => {
    return new ProductList(response.items)
  })
  .then((productList: IProductList) => {
    productList.products.forEach(product => {
      cardsContainer.addNewCard(new CardComponent(elements.cardCatalogTemplate, events, product.id).render(product))
    })
    cardsContainer.render(cardsContainer.cards)
  })

events.on('card:open', (card: Record<string, string>) => {
  appApi.getCardById(settings.productUri, card.cardId)
    .then((product: IProduct) => {
      modal.modalContent.replaceChildren(new CardComponent(elements.cardPreviewTemplate, events, product.id).render(product))
      modal.render()
      modal.open()
    })
})



