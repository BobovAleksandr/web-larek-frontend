import { IApi } from "../../types/index.js";
import { IProduct } from "../../types/index.js";

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