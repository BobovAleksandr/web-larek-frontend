import { IApi, IProduct } from '../../types'

export class AppApi {
  private _baseApi: IApi;

  constructor(baseApi: IApi) {
    this._baseApi = baseApi
  }

  getProducts(): Promise<IProduct[]> {
    return this._baseApi.get<IProduct[]>(`/products`).then((products: IProduct[]) => products)
  }
}