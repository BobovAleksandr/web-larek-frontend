export class CardsContainer {
  protected container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container
  }

  render(cards: HTMLElement[]) {
    this.container.replaceChildren(...cards)
  }
}