# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```
или
```
yarn
yarn start
```
## Сборка
```
npm run build
```
или
```
yarn build
```

# Базовый код

## Слои:
1. Модель данных (хранение и изменение данных)
2. Отображение данных
3. Презентер для соединения модели с отображением

---

# Слой данных

## Типы

### Тип Payment
Тип определяет варианты оплаты товара

### Тип Category
Тип определяет список категорий товаров

## Классы

### Класс ProductList
Класс хранит массив товаров полученный с сервера. Конструктор класса принимает массив товаров - `constructor(products: IProduct[])`

Поля и методы класса:
1. `products: IProduct[]` - массив товаров.
2. `_selectedProduct: IProduct | null` - поле для хранения текущего товара, выбранного пользователем.
3. `selectedProduct(id: string)` - сеттер, принимает id товара, ищет его в массиве товаров и присваивает в поле `_selectedProduct`
4. `selectedProduct(): IProduct` - геттер, возвращает объект текущего выбранного товара.

### Класс Basket
Класс хранит информацию о товарах, добавленных в корзину пользователем. Конструктор класса принимает массив товаров - `constructor(products: IProduct[])`

Поля и методы класса:
1. `products: IProduct[]` - массив товаров в корзине.
2. `add(newProduct: IProduct)` - метод принимает объект товара и добавляет его в корзину.
3. `remove(id: string)` - метод принимает id товара и удаляет его из корзины.
4. `clear()` - метод удаляет все товары из корзины.
5. `createOrder()` - метод возвращает массив товаров, находящихся в корзине для дальнейшего оформления заказа.
6. `totalPrice()` - геттер, возвращает общую стоимость товаров в корзине.

### Класс Order
Класс для получения и хранения информации о заказе: список товаров, информация о пользователе из формы. Конструктор класса принимает массив товаров из корзины для дальнейшего оформления заказа.

Поля и методы класса:
1. `products: IProduct[]` - массив товаров в заказе.
2. `paymentMethod(paymentInputValue: Payment)` - сеттер, принимает тип оплаты.
3. `email(emailInputValue: string)` - сеттер, принимает email пользователя.
4. `phone(phoneInputValue: string)` - сеттер, принимает номер телефона пользователя.
5. `newOrder(): IOrder` - геттер, возвращает сформированный объект заказа.

### Класс Api
Класс для хранения методов обращения к серверу по API. Конструктор класса принимает базовый URL адрес (`baseUrl`) и дополнительные параметры запроса (`options`)

Поля и методы класса:
1. `handleResponse<T>` - дженерик метод для обработки ответа от сервера, принимает ответ от сервера, возвращает JSON-объект от сервера или ошибку.
2. `get<T>` - дженерик метод для базового запроса к серверу, принимает добавочный адрес для обращения, вызывает колбэк `handleResponse<T>` при получении ответа.
3. `post<T>` - дженерик метод, для отправки объекта заказа пользователя на сервер. Принимает добавочный адрес для обращения, объект заказа и метод запроса - по умолчанию - POST. Вызывает колбэк `handleResponse<T>` при получении ответа.

---

# Слой отображения
Слой отображения отвечает за отображение и изменение элементов на странице. 

## Константы 
В файле `constants.ts` объявлены константы с адресами запросов API DOM-элементы страницы: шаблоны, модальное окно, контейнеры для элементов отображения контента.

## Классы

### Класс CardsContainer
Класс для хранения и отображения массива карточек товаров. Конструктор класса принимает DOM-элемент контейнера для контента (карточек) - `constructor(container: HTMLElement)`

`render(cards: HTMLElement[])` - Единственный метод класса принимает массив карточек и рендерит их в `container`.

### Класс BasketIcon
Класс для создания компонента иконки корзины на главной странице. Конструктор класса принимает DOM-элемент иконки корзины и экземпляр класса `IEvents`, для создания кастомных событий - `constructor(basketButton: HTMLButtonElement, events: IEvents)`

Поля и методы класса:
1. `basketCounter: HTMLSpanElement` - поле для хранения количества товаров в корзине.
2. `newCount(count: string)` - сеттер, устаналивает новое значение поля `basketCounter`
3. `render()` - метод возвращает элемент иконки корзины для отображения на странице.

### Класс ModalComponent
Класс для создания компонента модального окна. Контсруктор класса принимает DOM-элемент модального окна и экземпляр объекта `IEvents`, для геренации кастомных событий. Поле класса `modalContent` является контейнером для рендера различного принимаего контента.

В классе объявляются: элемент кнопки закрытия модального окна, методы `open()` и `close()` для его открытия и закрытия, слушатели нажатий на кнопку закрытия, клавишу Esc и бэкдроп для закрытия модального окна. Так же класс имеет метод `render()`, который возвращает DOM-элемент модального окна.

### Класс BaseComponent
Абстрактный класс для создания компонентов страницы через шаблоны HTML-элементов. Конструктор класса принимает шаблон HTML-компонента, и экземпляр объекта `IEvents` для создания событий - `constructor(template: HTMLTemplateElement, events: IEvents)`

### Класс CardComponent
Класс для создания компонента карточки товара. Расширяет класс BaseComponent. Конструктор принимает HTML-шаблон карточки, экземпляр объекта `IEvents` для создания событий, передается в родительский через super(). Так же в констркторе дополнительно назначается слушатель на нажатие по самой карточке и , при наличии соответствущих элементов в шаблоне, назначаются слушатели на кнопки "Купить" и "Удалить".

В классе объявляются элементы карточки - заголовок, категория, описание, стоимость, ссылка на изображение, кнопка "Купить", кнопка "Удалить".

Поля и методы класса:
1. `cardId: string;` - поле для хранения id товара.
2. `id()` - геттер, возвращает id карточки.
3. `deleteCard()` - удаляет DOM-элемент карточки.
4. `render(cardData: IProduct): HTMLElement` - принимает объект товара, присваивает элементам карточки (при их наличии) значения соотвествущих свойств объекта и возвращает DOM=элемент карточки.

### Класс SuccessComponent
Класс для создания компонента окна с сообщением об успешном оформлении заказа. Расширяет класс `BaseComponent`. Конструктор класса принимает шаблон HTML-компонента, и экземпляр объекта `IEvents` для создания событий, передается в родительский через super(). 

В классе компонента дополнительно объявляются элементы заголовка, текста и кнопки закрытия. Так же на кнопку вешается слушатель, генерируя кастомное событие.

Класс имеет единственный метод - `render(totalPrice: number)`, который возвращает компонент для отображения на странице. Принимает значение суммарной стоимости товаров в заказе, рисваивая значение с текстом в поле `description`.

### Класс FormComponent
Класс для создания компонента формы. Расширяет класс BaseComponent. Конструктор принимает HTML-шаблон формы, экземпляр объекта IEvents для создания событий, передается в родительский через super(). 

В классе компонента дополнительно объявляются базовые для всех форм DOM-элементы - заголовок, кнопка сабмита, span для текста ошибки валидации, инпуты.

Так же в классе добавляются слушатели на изменение данных полей ввода формы и сабмита формы, создавая кастомные события для дальнейшей обработки.

Поля и методы класса:
1. `inputsValues()` - геттер, возвращает объект типа `Record<string, string>` с именами инпутов и их значениями.
2. `valid(isValid: boolean)` - сеттер, устанавливает булево значение валидности формы, принимает булево значение статуса валидации.
3. `checkValid(errorMessage?: string)` - метод для вызова методов отображения или удаления текста ошибки валидации и блокировки / разблокировки кнопки сабмита формы. Опционально принимает текст ошибки для отображения.
4. `showInputError(field: string, errorMessage: string)` - защищенный метод для отображения ошибки валидации. Принимает текст ошибки.
5. `hideInputError(field: string)` - защищенный метод для удаления текста ошибки валидации.
6. `reset()` - метод для сброса полей формы и удаления текста ошибки валидации.
7. `render()` - метод возвращает компонент формы для рендера на странице.

### Класс OrderComponent
Класс для создания компонента первой формы окна заказа, расширяет класс FormComponent. (вторая форма оформления заказа не нуждается в доп. классах, создается от класса FormComponent). Конструктор принимает HTML-шаблон формы, экземпляр объекта IEvents для создания событий, передается в родительский через super().  

В классе дополнительно объявляются кнопки выбора способа оплаты заказа, на которые вешается слушатель нажатия.

Поля и методы класса:
1. `_paymentMethod: object;` - объект типа `Record<string, string>` с информацией о способе оплаты.
2. `paymerntMethod()` - геттер, возвращает объект `_paymentMethod` с информацией о способе оплаты.
3. `handleButtonClick(event: MouseEvent)` - приватный метод-обработчик нажатия на кнопку с типом оплаты. Переключает визуальный стиль выбранной кнопки, присваивает новый способ оплаты в поле `_paymentMethod`.

### Класс BasketComponent
Класс для создания компонента корзины со списком товаров. Расширяет класс BaseComponent. Конструктор класса принимает HTML-шаблон кмопонента и экземпляр класса `IEvents` для создания кастомных событий, передается в родительский конструктор через `super()`

В классе определяются элементы заголовка, кнопки "Купить", контейнера для списка карточек, поля суммарной стоимости корзины. На кнопку "Купить" вешается слушатель клика.

Поля и методы класса:
1. `basketProducts: CardComponent[]` - массив карточек товаров в корзине.  
2. `render(products: IProduct[], template: HTMLTemplateElement)` - метод принимает массив товаров и шаблон карточки для создания компонентов карточки на основании класса `Card` и возвращает массив элементов карточек для отображения в корзине.












---

# Слой презентера
Код взаимодействия предсталвения и данных находится в файле `index.ts`. \
Взаимодействие осуществляется за счет событий, генерируемых брокером и обработчиками, описанными в `index.ts`
В `index.ts` создаются экземлпяры необходимых классов и настраивается обработка событий.


События, генерируемые системой:
- `cards:changed` - изменение массива карточек
- `card:open` - откртие карточки товара в модальном окне

События, генерируемые пользователем при взаимодействии с интерфейсом:
- `card:addToBasket` - добавление карточки в корзину
- `card:removeFromBasket` - добавление карточки в корзину
- `modal:open` - открытие модального окна
- `modal:close` - закрытие модального окна
- `card:addToBasket` - событие добавления товара в корзину
- `basket:submit` - сабмит модального окна корзины
- `basket:changed` - изменение корзины
- `payModal:input` - изменение данных в форме модального окна со способом оплаты и адресом
- `payModal:submit` - сабмит модального окна со способом оплаты и адресом
- `contactsModal:input` - изменение данных в форме модального окна с email и телефоном
- `contactsModal:submit` - сабмит модального окна с email и телефоном



