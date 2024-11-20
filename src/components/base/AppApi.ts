import { IApi, IProduct } from '../../types'

export class AppApi {
  private _baseApi: IApi;
  productList: IProduct[];

  constructor(baseApi: IApi) {
    this._baseApi = baseApi
  }

  getData(uri: string) {
    return this._baseApi.get(uri)
  }

  getCardById(uri: string, id: string) {
    return this._baseApi.get(`${uri}/${id}`)
  }
}


// TODO описать класс или поправить описание