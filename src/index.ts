import { CardComponent } from './components/CardComponent';
import { EventEmitter, IEvents } from './components/base/events';
import { IApi, Order, Product } from './types';
import { Api } from './components/base/api';
import { API_URL, settings } from './utils/constants';
import { AppApi } from './components/base/appApi';
import { elements } from './utils/constants';
import { CardsContainer } from './components/CardsContainer';
import './scss/styles.scss';
import { ModalComponent } from './components/base/ModalComponent';
import { SuccessComponent } from './components/SuccessComponent';
import { OrderComponent } from './components/OrderComponent';

const modalContent = document.querySelector('.modal__content')
const gallery = document.querySelector('.gallery')


const events: IEvents = new EventEmitter();

const baseApi: IApi = new Api(API_URL, settings)
const api = new AppApi(baseApi)

const testCard: Product = {
  id: "854cef69-976d-4c2a-a18c-2aa45046c390",
  description: "Если планируете решать задачи в тренажёре, берите два.",
  image: "./images/Subtract.svg",
  title: "+1 час в сутках",
  category: 'софт-скил',
  price: 750
}

const newContainer = new CardsContainer(elements.gallery)



events.on('basketIcon:changed', () => {
  console.log('a')
})



const modal = new ModalComponent(elements.modal, events)
const form = new OrderComponent(elements.orderTemplate, events)
modal.modalContent.append(form.render())
modal.open()