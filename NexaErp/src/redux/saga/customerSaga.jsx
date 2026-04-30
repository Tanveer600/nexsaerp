import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import customerService from '../services/customerService'
import {
  getAllCustomers,
  setAllCustomers,
  createCustomer,
  deleteCustomer,
  updateCustomer,
  createCustomerCompleted,
  updateCustomerCompleted,
  deleteCustomerCompleted,
  setIsLoading,
} from '../slice/customerSlice'

// ================= WORKER SAGAS =================

function* getcustomerSaga(action) {
  try {
    const data = yield call(customerService.getAll, action.payload)
    yield put(setAllCustomers(data))
  } catch (e) {
    yield put(setAllCustomers({ items: [], totalCount: 0 }))
  }
}

function* createCustomerSaga(action) {
  //console.log('>>> Saga: createCustomerSaga Triggered with:', action.payload)
  try {
    const res = yield call(customerService.create, action.payload)
    console.log('>>> Saga: createCustomerSaga Success Response:', res)
    yield put(createCustomerCompleted(res))
    yield put(getAllCustomers())
  } catch (e) {
    console.error('>>> Saga: Create Customer Error:', e)
    yield put(setIsLoading(false))
  }
}

function* updateCustomerSaga(action) {
  //console.log('>>> Saga: updateCustomerSaga Triggered with:', action.payload)
  try {
    const res = yield call(customerService.update, action.payload)
    console.log('>>> Saga: updateCustomerSaga Success Response:', res)
    yield put(updateCustomerCompleted(res))
    yield put(getAllCustomers())
  } catch (e) {
    console.error('>>> Saga: Update Customer Error:', e)
    yield put(setIsLoading(false))
  }
}

function* deleteCustomerSaga(action) {
  //console.log('>>> Saga: deleteCustomerSaga Triggered for ID:', action.payload)
  try {
    yield call(customerService.delete, action.payload)
    console.log('>>> Saga: deleteCustomerSaga Delete Successful')
    yield put(deleteCustomerCompleted(action.payload))
    yield put(getAllCustomers())
  } catch (e) {
    console.error('>>> Saga: Delete Customer Error:', e)
    yield put(setIsLoading(false))
  }
}

// ================= WATCHER SAGAS =================

function* watchGetCustomers() {
  // console.log('Watcher: watchGetCustomers Active', getAllCustomers.type)
  yield takeLatest(getAllCustomers.type, getcustomerSaga)
}

function* watchCreateCustomer() {
  //console.log('Watcher: watchCreateCustomer Active', createCustomer.type)
  yield takeLatest(createCustomer.type, createCustomerSaga)
}

function* watchUpdateCustomer() {
  //console.log('Watcher: watchUpdateCustomer Active', updateCustomer.type)
  yield takeLatest(updateCustomer.type, updateCustomerSaga)
}

function* watchDeleteCustomer() {
  //console.log('Watcher: watchDeleteCustomer Active', deleteCustomer.type)
  yield takeLatest(deleteCustomer.type, deleteCustomerSaga)
}

// ================= ROOT BRANCH SAGA =================

export function* customerSaga() {
  yield all([
    fork(watchGetCustomers),
    fork(watchCreateCustomer),
    fork(watchUpdateCustomer),
    fork(watchDeleteCustomer),
  ])
}
