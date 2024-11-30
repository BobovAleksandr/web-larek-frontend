import { IProduct } from "../../types"
import { CategorySelectors, CDN_URL } from "../../utils/constants"
import { ensureElement } from "../../utils/utils"
import { IEvents } from "../base/events"
import { Card } from "./common/Card"

// Карточка товара (каталог)
export class CardCatalog extends Card {
  constructor(container: HTMLElement, events: IEvents) {
    super(container, events)

    this._image = ensureElement<HTMLImageElement>('.card__image', this.container)
    this._category = ensureElement('.card__category', this.container)
  }

  render(product: IProduct): HTMLElement {
    this._category.classList.add(`card__category_${CategorySelectors[product.category]}`)
    this._category.textContent = product.category
    
    this.setImage(this._image, CDN_URL + product.image, product.title)
    this.container.addEventListener('click', () => {
      this.events.emit('catalogCard:pressed', product)
    })

    return super.render(product)
  }
}