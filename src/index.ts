import { Card } from './components/base/Card';
import { EventEmitter, IEvents } from './components/base/events';
import { IApi, IProduct, Product } from './types';
import { Api } from './components/base/api';
import { API_URL, settings } from './utils/constants';
import { AppApi } from './components/base/AppApi';
import './scss/styles.scss';

const modalContent = document.querySelector('.modal__content')
const gallery = document.querySelector('.gallery')
const cardPreviewTemplate: HTMLTemplateElement = document.querySelector('#card-preview')
const cardCatalogTemplate: HTMLTemplateElement = document.querySelector('#card-catalog')

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

const cardElement = new Card(cardPreviewTemplate, events)
const cardObj = new Product(testCard)
cardElement.setData(cardObj)

gallery.append(cardElement.render())
