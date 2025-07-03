import axios from 'axios';
import { ApiResponse } from './ApiResponses';

let DESSERT_API_URL = 'http://localhost:8085/dessert_api';

export async function getAllDesserts() {
  let status = new ApiResponse();
  await axios
    .get(DESSERT_API_URL + '/Dessert/getDesserts')
    .then(res => {
      status.responseData = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}
