// import { IEvents } from "./base/events";
// import { FormComponent } from "./base/OLD FormComponent";

// export class OrderComponent extends FormComponent {
//   protected buttonsPayment: NodeListOf<HTMLButtonElement>;
//   _paymentMethod: Record<string, string> | null;

//   constructor(template: HTMLTemplateElement, events: IEvents) {
//     super(template, events)
//     this.buttonsPayment = this.container.querySelectorAll('.order__buttons')
//     this._paymentMethod = null;

//     this.buttonsPayment.forEach((button) => {
//       button.addEventListener('click', this.handleButtonClick.bind(this));
//     });
//   }

//   private handleButtonClick(event: MouseEvent) {
//     const target = event.target as HTMLButtonElement;
//     this.buttonsPayment.forEach((button) => {
//       button.classList.remove('button_alt-active');
//     });
//     target.classList.add('button_alt-active');
//     this._paymentMethod = { paymentMethod: target.textContent }
//   }

//   get paymerntMethod() {
//     return this._paymentMethod
//   }
  
// }