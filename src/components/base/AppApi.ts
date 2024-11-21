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
}


// TODO описать класс или поправить описание