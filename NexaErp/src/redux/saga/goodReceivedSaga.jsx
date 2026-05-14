import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import goodReceivedService from '../services/goodReceivedService'
import {
  getAllGoodReceiveds,
  setAllGoodReceiveds,
  createGoodReceived,
  deleteGoodReceived,
  createGoodReceivedCompleted,
  updateGoodReceivedCompleted,
  deleteGoodReceivedCompleted,
  setIsLoading,
  updateGoodReceived,
} from '../slice/goodReceivedSlice'
import { func } from 'prop-types'
import deliveryNoteService from '../services/deliveryNoteService'
import { updateProduct } from '../slice/productSlice'
import { deleteDeliveryNoteCompleted, getAllDeliveryNotes } from '../slice/deliveryNotesSlice'

// ================= WORKER SAGAS =================

function* getAllGoodReceivedSaga(action) {
  try {
    const data = yield call(goodReceivedService.getAll, action.payload)
    yield put(setAllGoodReceiveds(data))
  } catch (e) {
    yield put(setAllGoodReceiveds({ items: [], totalCount: 0 }))
    yield put(setIsLoading(false))
  }
}

function* createGoodReceivedSaga(action) {
  console.log('>>> Saga: create GoodReceived Triggered with:', action.payload)
  try {
    const res = yield call(goodReceivedService.create, action.payload)
    console.log('>>> Saga: createGoodReceived Success Response:', res)
    yield put(createGoodReceivedCompleted(res))
    yield put(getAllGoodReceiveds())
  } catch (e) {
    console.error('>>> Saga: Create GoodReceived note Error:', e)
    yield put(setIsLoading(false))
  }
}

function* updateGoodReceivedSaga(action) {
  console.log('>>> Saga: GoodReceived Triggered with:', action.payload)
  try {
    const res = yield call(goodReceivedService.update, action.payload)
    console.log('>>> Saga: updateGoodReceived Success Response:', res)
    yield put(updateGoodReceivedCompleted(res))
    yield put(getAllGoodReceiveds())
  } catch (e) {
    console.error('>>> Saga: Update GoodReceived  Error:', e)
    yield put(setIsLoading(false))
  }
}

function* deleteGoodReceivedSaga(action) {
  console.log('>>> Saga: deleteGoodReceived Triggered for ID:', action.payload)
  try {
    yield call(goodReceivedService.delete, action.payload)
    console.log('>>> Saga: deleteGoodReceived Delete Successful')
    yield put(deleteGoodReceivedCompleted(action.payload))
    yield put(getAllGoodReceiveds())
  } catch (e) {
    console.error('>>> Saga: Delete GoodReceived Error:', e)
    yield put(setIsLoading(false))
  }
}

// ================= WATCHER SAGAS =================

function* watchGetGoodReceiveds() {
  console.log('Watcher: watch GoodReceived Active', getAllGoodReceiveds.type)
  yield takeLatest(getAllGoodReceiveds.type, getAllGoodReceivedSaga)
}

function* watchCreateGoodReceived() {
  console.log('Watcher: watchCreateGoodReceived Active', createGoodReceived.type)
  yield takeLatest(createGoodReceived.type, createGoodReceivedSaga)
}

function* watchUpdateGoodReceived() {
  console.log('Watcher: watchUpdateGoodReceived Active', updateGoodReceived.type)
  yield takeLatest(updateGoodReceived.type, updateGoodReceivedSaga)
}

function* watchDeleteGoodReceived() {
  //console.log('Watcher: watchDeleteDeliveryNote Active', deleteDeliveryNote.type)
  yield takeLatest(deleteGoodReceived.type, deleteGoodReceivedSaga)
}

// ================= ROOT BRANCH SAGA =================

export function* goodReceivedSaga() {
  yield all([
    fork(watchGetGoodReceiveds),
    fork(watchCreateGoodReceived),
    fork(watchUpdateGoodReceived),
    fork(watchDeleteGoodReceived),
  ])
}
