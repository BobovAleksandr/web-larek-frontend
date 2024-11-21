export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
  productUri: '/product',
  currency: ' синапсов'
};

export enum CategorySelectors {
  'софт-скил' = 'soft',
  'другое' = 'other',
  'дополнительное' = 'additional',
  'кнопка' = 'button',
  'хард-скил' = 'hard',
}

interface IElements {
  cardCatalogTemplate: HTMLTemplateElement,
  cardPreviewTemplate: HTMLTemplateElement;
  cardBasketTemplate: HTMLTemplateElement,
  successTemplate: HTMLTemplateElement,
  basketTemplate: HTMLTemplateElement,
  orderTemplate: HTMLTemplateElement,
  contactsTemplate: HTMLTemplateElement,
  basketIcon: HTMLButtonElement;
  gallery: HTMLElement,
  modal: HTMLDivElement,
}

export const elements: IElements = {
  cardCatalogTemplate: document.querySelector('#card-catalog'),
  cardPreviewTemplate: document.querySelector('#card-preview'),
  cardBasketTemplate: document.querySelector('#card-basket'),
  successTemplate: document.querySelector('#success'),
  basketTemplate: document.querySelector('#basket'),
  orderTemplate: document.querySelector('#order'),
  contactsTemplate: document.querySelector('#contacts'),
  basketIcon: document.querySelector('.header__basket'),
  gallery: document.querySelector('.gallery'),
  modal: document.querySelector('.modal')
}
