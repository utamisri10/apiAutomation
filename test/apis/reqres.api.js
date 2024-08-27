import chaiModule from "chai";
import chaiHttp from "chai-http";

const chai = chaiModule.use(chaiHttp);

const BASE_URL = 'https://reqres.in/api'


async function makeRequest(method, endpoint, data = null) {
  const res = await chai.request(BASE_URL)[method](endpoint).send(data);
  return {
    request: res.request,
    status: res.status,
    data: res.body,
  };
}

export const getListUsers = ({ 
  page 
}) => makeRequest('get', `/users?page=${page}`);

export const postCreateNewUser = ({ 
  data 
}) => makeRequest('post', '/users', data);

export const login = ({ 
  data 
}) => makeRequest('post', '/login', data);

export const getSingleUser = ({ 
  userID 
}) => makeRequest('get', `/users/${userID}`);

export const getListResources = ({
  page,
}) => makeRequest('get', `/unknown?page=${page}`);

export const getSingleResource = ({
  id,
}) => makeRequest('get', `/unknown/${id}`)

export const updateDataUser = ({
  data,
  id,
  method
}) => makeRequest(`${method}`, `/user/${id}`, data)

export const registerUser = ({
  data,
}) => makeRequest('post', `/register`, data)

export const getDelayResponse = ({
  delayTime
}) => makeRequest('get', `/users?delay=${delayTime}`)





