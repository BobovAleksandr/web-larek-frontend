export class CardsContainer {
  protected container: HTMLElement;
  protected _cards: HTMLElement[];

  constructor(container: HTMLElement) {
    this.container = container
    this._cards = []
  }

  addNewCard(card: HTMLElement) {
    this._cards.push(card)
  }

  get cards() {
    return this._cards
  }

  render(cards: HTMLElement[]) {
    this.container.replaceChildren(...cards)
  }
}

// TODO изменить описание в readme