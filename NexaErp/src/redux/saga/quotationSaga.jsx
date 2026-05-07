import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import quotationService from '../services/quotationService'
import {
  getAllQuotations,
  setAllQuotations,
  setQuotation,
  createQuotation,
  updateQuotation,
  deleteQuotation,
  createQuotationCompleted,
  updateQuotationCompleted,
  deleteQuotationCompleted,
  setIsLoading,
} from '../slice/quotationSlice'

function* getQuotationsSaga(action) {
  try {
    const data = yield call(quotationService.getAll, action.payload)
    yield put(setAllQuotations(data))
  } catch (e) {
    yield put(setAllQuotations({ items: [], totalCount: 0 }))
  }
}

function* createQuotationSaga(action) {
  console.log('>>> Saga: createQuotationSaga Triggered with:', action.payload)
  try {
    const res = yield call(quotationService.create, action.payload)
    console.log('>>> Saga: createQuotationSaga Success Response:', res)
    yield put(createQuotationCompleted(res))
    yield put(getAllQuotations())
  } catch (e) {
    console.error('FULL ERROR:', e)
    console.error('RESPONSE:', e?.response?.data)
    yield put(setIsLoading(false))
  }
}

function* updateQuotationSaga(action) {
  console.log('>>> Saga: updateQuotationSaga Triggered with:', action.payload)
  try {
    const res = yield call(quotationService.update, action.payload)
    console.log('>>> Saga: updateQuotationSaga Success Response:', res)
    yield put(updateQuotationCompleted(res))
    yield put(getAllQuotations())
  } catch (e) {
    console.error('>>> Saga: Update Quotation Error:', e)
    yield put(setIsLoading(false))
  }
}

function* deleteQuotationSaga(action) {
  console.log('>>> Saga: deleteQuotationSaga Triggered for ID:', action.payload)
  try {
    yield call(quotationService.delete, action.payload)
    yield put(deleteQuotationCompleted(action.payload))
    yield put(getAllQuotations())
  } catch (e) {
    console.error('>>> Saga: Delete Quotation Error:', e)
    yield put(setIsLoading(false))
  }
}

function* watchGetQuotations() {
  console.log('Watcher: watchGetQuotations Active', getAllQuotations.type)
  yield takeLatest(getAllQuotations.type, getQuotationsSaga)
}

function* watchCreateQuotation() {
  console.log('Watcher: watchCreateQuotation Active', createQuotation.type)
  yield takeLatest(createQuotation.type, createQuotationSaga)
}

function* watchUpdateQuotation() {
  console.log('Watcher: watchUpdateQuotation Active', updateQuotation.type)
  yield takeLatest(updateQuotation.type, updateQuotationSaga)
}

function* watchDeleteQuotation() {
  console.log('Watcher: watchDeleteQuotation Active', deleteQuotation.type)
  yield takeLatest(deleteQuotation.type, deleteQuotationSaga)
}

export function* quotationSaga() {
  yield all([
    fork(watchGetQuotations),
    fork(watchCreateQuotation),
    fork(watchUpdateQuotation),
    fork(watchDeleteQuotation),
  ])
}
