import { ensureElement } from "../utils/utils";
import { Component } from "./base/component";
import { IEvents } from "./base/events";
import { currency } from "./card";

export class Success extends Component {
	protected _sucessButton: HTMLButtonElement;
	protected _description: HTMLSpanElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this._description = ensureElement<HTMLSpanElement>('.order-success__description', this.container)
		this._sucessButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container)
		this._sucessButton.addEventListener('click', () => {
			events.emit('sucсessButton:pressed')
		})
	}

	render(data: { value: number }) {
		this._description.textContent = `Списано ${String(data.value)} ${currency}`
		return super.render();
	}
}