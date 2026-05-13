import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import vendorquotationService from '../services/vendorQuotationService'
import purchaseOrderItemService from '../services/purchaseOrderItemService'

import {
  getAllVendorQuotations,
  setAllVendorQuotations,
  setVendorQuotation,
  createVendorQuotation,
  updateVendorQuotation,
  deleteVendorQuotation,
  approveVendorQuotation,
  approveVendorQuotationCompleted,
  createVendorQuotationCompleted,
  updatevendorQuotationCompleted,
  deleteVendorQuotationCompleted,
  setIsLoading,
} from '../slice/vendorQuotationSlice'

function* getVendorQuotationsSaga(action) {
  try {
    const data = yield call(vendorquotationService.getAll, action.payload)
    yield put(setAllVendorQuotations(data))
  } catch (e) {
    yield put(setAllVendorQuotations({ items: [], totalCount: 0 }))
  }
}

function* createVendorQuotationSaga(action) {
  console.log('>>> Saga: createVendorQuotationSaga Triggered with:', action.payload)
  try {
    const res = yield call(vendorquotationService.create, action.payload)
    console.log('>>> Saga: createQuotationSaga Success Response:', res)
    yield put(createVendorQuotationCompleted(res))
    yield put(getAllVendorQuotations())
  } catch (e) {
    console.error('FULL ERROR:', e)
    console.error('RESPONSE:', e?.response?.data)
    yield put(setIsLoading(false))
  }
}

function* updateVendorQuotationSaga(action) {
  // console.log('>>> Saga: updateVendorQuotationSaga Triggered with:', action.payload)
  try {
    const res = yield call(vendorquotationService.update, action.payload)
    //  console.log('>>> Saga: updateVendorQuotationSaga Success Response:', res)
    yield put(updateVendorQuotationCompleted(res))
    yield put(getAllVendorQuotations())
  } catch (e) {
    console.error('>>> Saga: Update VendorQuotation Error:', e)
    yield put(setIsLoading(false))
  }
}

function* deleteVendorQuotationSaga(action) {
  // console.log('>>> Saga: deleteVendorQuotationSaga Triggered for ID:', action.payload)
  try {
    yield call(vendorquotationService.delete, action.payload)
    yield put(deleteVendorQuotationCompleted(action.payload))
    yield put(getAllVendorQuotations())
  } catch (e) {
    // console.error('>>> Saga: Delete VendorQuotation Error:', e)
    yield put(setIsLoading(false))
  }
}
function* approveVendorQuotationSaga(action) {
  // console.log('>>> Saga: approveQuotationSaga Triggered for ID:', action.payload)
  try {
    const res = yield call(purchaseOrderItemService.convertToPurchase, action.payload)
    // console.log('>>> Saga: approveQuotationSaga Success Response:', res)
    yield put(approveVendorQuotationCompleted(res.data || res))
    yield put(getAllVendorQuotations())
  } catch (e) {
    //console.error('>>> Saga: Approve VendorQuotation Error:', e)
    yield put(setIsLoading(false))
  }
}
function* watchVendorGetQuotations() {
  //console.log('Watcher: watchGetQuotations Active', getAllQuotations.type)
  yield takeLatest(getAllVendorQuotations.type, getVendorQuotationsSaga)
}

function* watchCreateVendorQuotation() {
  // console.log('Watcher: watchCreateQuotation Active', createQuotation.type)
  yield takeLatest(createVendorQuotation.type, createVendorQuotationSaga)
}
function* watchApproveVendorQuotation() {
  // console.log('Watcher: watchApproveQuotation Active', approveQuotation.type)
  yield takeLatest(approveVendorQuotation.type, approveVendorQuotationSaga)
}
function* watchUpdateVendorQuotation() {
  // console.log('Watcher: watchUpdateQuotation Active', updateQuotation.type)
  yield takeLatest(updateVendorQuotation.type, updateVendorQuotationSaga)
}

function* watchDeleteVendorQuotation() {
  //console.log('Watcher: watchDeleteQuotation Active', deleteQuotation.type)
  yield takeLatest(deleteVendorQuotation.type, deleteVendorQuotationSaga)
}

export function* vendorQuotationSaga() {
  yield all([
    fork(watchVendorGetQuotations),
    fork(watchCreateVendorQuotation),
    fork(watchUpdateVendorQuotation),
    fork(watchDeleteVendorQuotation),
    fork(watchApproveVendorQuotation),
  ])
}
