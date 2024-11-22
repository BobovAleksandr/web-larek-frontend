import './scss/styles.scss';
import { Api } from './components/base/api';
import { API_URL, templates, settings } from './utils/constants';
import { AppApi } from './components/base/appApi';

const api = new Api(API_URL)
const appApi = new AppApi(api)

const productList = new ProductList(events)

// Загрузить товары в productList 
appApi.getData(settings.productUri)
  .then((response: ApiListResponse<IProduct>) => {
    productList.products = response.items
  })
  .catch(error => console.log(error))




