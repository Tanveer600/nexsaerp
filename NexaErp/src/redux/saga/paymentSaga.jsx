import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import paymentService from '../services/paymentService'
import {
  getAllPayments,
  setAllPayments,
  createPayment,
  getPaymentList,
  setPaymentList,
  deletePayment,
  updatePayment,
  createPaymentCompleted,
  updatePaymentCompleted,
  deletePaymentCompleted,
  setIsLoading,
} from '../slice/paymentSlice'
import { func } from 'prop-types'

function* getPaymentSaga(action) {
  try {
    const data = yield call(paymentService.getAll, action.payload)
    yield put(setAllPayments(data))
  } catch (e) {
    yield put(setAllPayments({ items: [], totalCount: 0 }))
  }
}
function* getPaymentListSaga() {
  try {
    const data = yield call(paymentService.getList)
    console.log('>>> Saga: getPaymentListSaga Success Response:', data)
    yield put(setPaymentList(data))
  } catch (e) {
    yield put(setPaymentList([]))
  }
}
function* createPaymentSaga(action) {
  try {
    const res = yield call(paymentService.create, action.payload)
    console.log('>>> Saga: createPaymentSaga Success Response:', res)
    yield put(createPaymentCompleted(res))
    yield put(getAllPayments())
  } catch (e) {
    yield put(setIsLoading(false))
  }
}

function* updatePaymentSaga(action) {
  try {
    const res = yield call(paymentService.update, action.payload)
    yield put(updatePaymentCompleted(res))
    yield put(getAllPayments())
  } catch (e) {
    console.error('>>> Saga: Update Payment  Error:', e)
    yield put(setIsLoading(false))
  }
}

function* deletePaymentSaga(action) {
  try {
    yield call(paymentService.delete, action.payload)
    console.log('>>> Saga: deletePaymentSaga Delete Successful')
    yield put(deletePaymentCompleted(action.payload))
    yield put(getAllPayments())
  } catch (e) {
    console.error('>>> Saga: Delete Payment Error:', e)
    yield put(setIsLoading(false))
  }
}

function* watchGetPayments() {
  yield takeLatest(getAllPayments.type, getPaymentSaga)
}
function* watchGetPaymentList() {
  yield takeLatest(getPaymentList.type, getPaymentListSaga)
}
function* watchCreatePayment() {
  yield takeLatest(createPayment.type, createPaymentSaga)
}

function* watchUpdatePayment() {
  yield takeLatest(updatePayment.type, updatePaymentSaga)
}

function* watchDeletePayment() {
  yield takeLatest(deletePayment.type, deletePaymentSaga)
}

// ================= ROOT BRANCH SAGA =================

export function* paymentSaga() {
  yield all([
    fork(watchGetPayments),
    fork(watchCreatePayment),
    fork(watchUpdatePayment),
    fork(watchDeletePayment),
    fork(watchGetPaymentList),
  ])
}
