export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const currency = ' синапсов'

export const endpoints = {
  productsGetUri: '/product',
  productPostUri: '/order',
};

export const phoneRegEx = /^\+?\d[\d\s()-]{8,20}$/
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

export const events = {
  catalogChanged: 'catalog:changed',
  catalogPressed: 'catalogCard:pressed',
  productSelected: 'product:selected',
  cardPreviewButtonPressed: 'cardPreviewButton:pressed',
  cardProductChanged: 'card:productChanged',
  basketAmountChanged: 'basketAmount:Changed',
  basketCardButtonPressed: 'basketCardButton:pressed',
  basketIconPressed: 'basketIcon:pressed',
  basketInit: 'basket:init',
  basketChanged: 'basket:changed',
  modalOpen: 'modal:open',
  modalClose: 'modal:close',
  basketSubmit: 'basket:submit',
  baskeetDataChanged: 'basketData:changed',
  orderFormChanged: 'orderForm:changed',
  orderFormChecked: 'orderForm:checked',
  orderFormSubmit: 'orderForm:submit',
  orderFormDataChanged: 'orderFormData:changed',
  contactsFormChanged: 'contactsForm:changed',
  contactsFormChecked: 'contactsForm:checked',
  contactsFormSubmit: 'contactsForm:submit',
  contactsFormDataChanged: 'contactsData:changed',
  orderError: 'order:error',
  orderSent: 'order:sent',
  successButtonPressed: 'sucсessButton:pressed',
  basketCleared: 'basket:cleared'
}
