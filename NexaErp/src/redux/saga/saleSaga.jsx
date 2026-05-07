import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import saleService from '../services/saleService'
import {
  getAllSales,
  setAllSales,
  setSale,
  createSale,
  updateSale,
  deleteSale,
  createSaleCompleted,
  updateSaleCompleted,
  deleteSaleCompleted,
  setIsLoading,
} from '../slice/saleSlice'

function* getSalesSaga(action) {
  try {
    const data = yield call(saleService.getAll, action.payload)
    yield put(setAllSales(data))
  } catch (e) {
    yield put(setAllSales({ items: [], totalCount: 0 }))
  }
}

function* createSaleSaga(action) {
  console.log('>>> Saga: createSaleSaga Triggered with:', action.payload)
  try {
    const res = yield call(saleService.create, action.payload)
    console.log('>>> Saga: createSaleSaga Success Response:', res)
    yield put(createSaleCompleted(res))
    yield put(getAllSales())
  } catch (e) {
    console.error('FULL ERROR:', e)
    console.error('RESPONSE:', e?.response?.data)
    yield put(setIsLoading(false))
  }
}

function* updateSaleSaga(action) {
  console.log('>>> Saga: updateSaleSaga Triggered with:', action.payload)
  try {
    const res = yield call(saleService.update, action.payload)
    console.log('>>> Saga: updateSaleSaga Success Response:', res)
    yield put(updateSaleCompleted(res))
    yield put(getAllSales())
  } catch (e) {
    console.error('>>> Saga: Update Sale Error:', e)
    yield put(setIsLoading(false))
  }
}

function* deleteSaleSaga(action) {
  console.log('>>> Saga: deleteSaleSaga Triggered for ID:', action.payload)
  try {
    yield call(saleService.delete, action.payload)
    yield put(deleteSaleCompleted(action.payload))
    yield put(getAllSales())
  } catch (e) {
    console.error('>>> Saga: Delete Sale Error:', e)
    yield put(setIsLoading(false))
  }
}

function* watchGetSales() {
  console.log('Watcher: watchGetSales Active', getAllSales.type)
  yield takeLatest(getAllSales.type, getSalesSaga)
}

function* watchCreateSale() {
  console.log('Watcher: watchCreateSale Active', createSale.type)
  yield takeLatest(createSale.type, createSaleSaga)
}

function* watchUpdateSale() {
  console.log('Watcher: watchUpdateSale Active', updateSale.type)
  yield takeLatest(updateSale.type, updateSaleSaga)
}

function* watchDeleteSale() {
  console.log('Watcher: watchDeleteSale Active', deleteSale.type)
  yield takeLatest(deleteSale.type, deleteSaleSaga)
}

export function* saleSaga() {
  yield all([
    fork(watchGetSales),
    fork(watchCreateSale),
    fork(watchUpdateSale),
    fork(watchDeleteSale),
  ])
}
