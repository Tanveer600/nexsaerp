import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import invoiceService from '../services/invoiceService'
import {
  getAllInvoices,
  setAllInvoices,
  createInvoice,
  getInvoiceList,
  setInvoiceList,
  deleteInvoice,
  updateInvoice,
  createInvoiceCompleted,
  updateInvoiceCompleted,
  deleteInvoiceCompleted,
  setIsLoading,
} from '../slice/invoiceSlice'
import { func } from 'prop-types'

// ================= WORKER SAGAS =================

function* getInvoiceSaga(action) {
  try {
    const data = yield call(invoiceService.getAll, action.payload)
    yield put(setAllInvoices(data))
  } catch (e) {
    yield put(setAllInvoices({ items: [], totalCount: 0 }))
  }
}
function* getInvoiceListSaga() {
  try {
    const data = yield call(invoiceService.getList)
    console.log('>>> Saga: getInvoiceListSaga Success Response:', data)
    yield put(setInvoiceList(data))
  } catch (e) {
    yield put(setInvoiceList([]))
  }
}
function* createInvoiceSaga(action) {
  //console.log('>>> Saga: createInvoiceSaga Triggered with:', action.payload)
  try {
    const res = yield call(invoiceService.create, action.payload)
    console.log('>>> Saga: createInvoiceSaga Success Response:', res)
    yield put(createInvoiceCompleted(res))
    yield put(getAllInvoices())
  } catch (e) {
    console.error('>>> Saga: Create Invoice Error:', e)
    yield put(setIsLoading(false))
  }
}

function* updateInvoiceSaga(action) {
  //console.log('>>> Saga: updateInvoiceSaga Triggered with:', action.payload)
  try {
    const res = yield call(invoiceService.update, action.payload)
    //console.log('>>> Saga: updateInvoiceSaga Success Response:', res)
    yield put(updateInvoiceCompleted(res))
    yield put(getAllInvoices())
  } catch (e) {
    console.error('>>> Saga: Update Invoice Error:', e)
    yield put(setIsLoading(false))
  }
}

function* deleteInvoiceSaga(action) {
  //console.log('>>> Saga: deleteInvoiceSaga Triggered for ID:', action.payload)
  try {
    yield call(invoiceService.delete, action.payload)
    console.log('>>> Saga: deleteInvoiceSaga Delete Successful')
    yield put(deleteInvoiceCompleted(action.payload))
    yield put(getAllInvoices())
  } catch (e) {
    console.error('>>> Saga: Delete Invoice Error:', e)
    yield put(setIsLoading(false))
  }
}

// ================= WATCHER SAGAS =================

function* watchGetInvoices() {
  // console.log('Watcher: watchGetInvoices Active', getAllInvoices.type)
  yield takeLatest(getAllInvoices.type, getInvoiceSaga)
}
function* watchGetInvoiceList() {
  //console.log('Watcher: watchGetInvoiceList Active', getInvoiceList.type)
  yield takeLatest(getInvoiceList.type, getInvoiceListSaga)
}
function* watchCreateInvoice() {
  //console.log('Watcher: watchCreateInvoice Active', createInvoice.type)
  yield takeLatest(createInvoice.type, createInvoiceSaga)
}

function* watchUpdateInvoice() {
  //console.log('Watcher: watchUpdateInvoice Active', updateInvoice.type)
  yield takeLatest(updateInvoice.type, updateInvoiceSaga)
}

function* watchDeleteInvoice() {
  //console.log('Watcher: watchDeleteInvoice Active', deleteInvoice.type)
  yield takeLatest(deleteInvoice.type, deleteInvoiceSaga)
}

// ================= ROOT BRANCH SAGA =================

export function* invoiceSaga() {
  yield all([
    fork(watchGetInvoices),
    fork(watchCreateInvoice),
    fork(watchUpdateInvoice),
    fork(watchDeleteInvoice),
    fork(watchGetInvoiceList),
  ])
}
