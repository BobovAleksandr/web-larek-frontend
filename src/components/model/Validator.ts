import { ContactsFormData, OrderFormData } from "../../types"
import { emailRegEx, phoneRegEx } from "../../utils/constants"
import { IEvents } from "../base/events"

export class Validator {
  constructor(protected events: IEvents) {
    this.events = events
  }

  checkOrderForm(data: OrderFormData): void {
    const validity: { status: boolean, error: string } = {
      status: false,
      error: ''
    }
    
    if (!data.payment) {
      validity.status = false
      validity.error = 'Выберите способ оплаты'
    } 
    if (data.address === '') {
      validity.status = false
      validity.error = 'Укажите ваш адрес'
    } else if (data.payment && data.address) {
      validity.status = true,
      validity.error = ''
    }
    this.events.emit('orderForm:checked', validity)
  }
  
  checkContactsFormValid(data: ContactsFormData): void {
    const validity: { status: boolean, error: string } = {
      status: false,
      error: ''
    }
    if (!data.phone && !data.email) {
      validity.error = 'Заполните необходимые поля'
    }
    if (!data.email || data.email.trim() === '') {
      validity.error = 'Укажите ваш email'
    } 
    if (data.email && !data.email.match(emailRegEx)) {
      validity.error = 'Некорректный формат email'
    } 
    if (!data.phone || data.phone.trim() === '') {
      validity.error = 'Укажите ваш номер телефона'
    } 
    if (data.phone && !data.phone.match(phoneRegEx)) {
      validity.error = 'Некорректный формат номера телефона'
    } else if (data.phone.match(phoneRegEx) && data.email.match(emailRegEx)) {
      validity.status = true,
      validity.error = ''
    }
    this.events.emit('contactsForm:checked', validity)
  }  
}