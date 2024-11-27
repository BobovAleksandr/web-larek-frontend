export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const endpoints = {
  productsGetUri: '/product',
  productPostUri: '/order',
};

export const phoneRegEx = /^\+(?:[0-9] ?){6,14}[0-9]$/
export const emailRegEx = /^[^@]+@([^@.]+\.)+[^@.]+$/

export enum CategorySelectors {
  'софт-скил' = 'soft',
  'другое' = 'other',
  'дополнительное' = 'additional',
  'кнопка' = 'button',
  'хард-скил' = 'hard',
}

interface ITemplates {
  cardCatalogTemplate: HTMLTemplateElement,
  cardPreviewTemplate: HTMLTemplateElement;
  cardBasketTemplate: HTMLTemplateElement,
  successTemplate: HTMLTemplateElement,
  basketTemplate: HTMLTemplateElement,
  orderTemplate: HTMLTemplateElement,
  contactsTemplate: HTMLTemplateElement,
}

export const templates: ITemplates = {
  cardCatalogTemplate: document.querySelector('#card-catalog'),
  cardPreviewTemplate: document.querySelector('#card-preview'),
  cardBasketTemplate: document.querySelector('#card-basket'),
  successTemplate: document.querySelector('#success'),
  basketTemplate: document.querySelector('#basket'),
  orderTemplate: document.querySelector('#order'),
  contactsTemplate: document.querySelector('#contacts'),
}
