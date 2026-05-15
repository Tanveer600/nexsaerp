import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import deliveryNotesService from '../services/deliveryNoteService'
import {
  getAllDeliveryNotes,
  setAllDeliveryNotes,
  createDeliveryNote,
  deleteDeliveryNote,
  createDeliveryNoteCompleted,
  updateDeliveryNoteCompleted,
  deleteDeliveryNoteCompleted,
  setIsLoading,
  updateDeliveryNote,
} from '../slice/deliveryNotesSlice'
import { func } from 'prop-types'
// import deliveryNoteService from '../services/deliveryNoteService'
// import { updateProduct } from '../slice/productSlice'

// ================= WORKER SAGAS =================

function* getDeliveryNoteSaga(action) {
  try {
    const data = yield call(deliveryNotesService.getAll, action.payload)
    yield put(setAllDeliveryNotes(data))
  } catch (e) {
    yield put(setAllDeliveryNotes({ items: [], totalCount: 0 }))
  }
}

function* createDeliveryNoteSaga(action) {
  // console.log('>>> Saga: create DeliveryNote Triggered with:', action.payload)
  try {
    const res = yield call(deliveryNotesService.create, action.payload)
    // console.log('>>> Saga: createDeliveryNoteSaga Success Response:', res)
    yield put(createDeliveryNoteCompleted(res))
    yield put(getAllDeliveryNotes())
  } catch (e) {
    console.error('>>> Saga: Create delivery note Error:', e)
    yield put(setIsLoading(false))
  }
}

function* updateDeliveryNoteSaga(action) {
  //console.log('>>> Saga: updateDeliveryNoteSaga Triggered with:', action.payload)
  try {
    const res = yield call(deliveryNotesService.update, action.payload)
    //console.log('>>> Saga: updateProductSaga Success Response:', res)
    yield put(updateDeliveryNoteCompleted(res))
    yield put(getAllDeliveryNotes())
  } catch (e) {
    // console.error('>>> Saga: Update DeliveryNote  Error:', e)
    yield put(setIsLoading(false))
  }
}

function* deleteDeliveryNoteSaga(action) {
  //console.log('>>> Saga: deleteProductSaga Triggered for ID:', action.payload)
  try {
    yield call(deliveryNotesService.delete, action.payload)
    //  console.log('>>> Saga: deleteDeliveryNoteSaga Delete Successful')
    yield put(deleteDeliveryNoteCompleted(action.payload))
    yield put(getAllDeliveryNotes())
  } catch (e) {
    // console.error('>>> Saga: Delete DeliveryNote Error:', e)
    yield put(setIsLoading(false))
  }
}

// ================= WATCHER SAGAS =================

function* watchGetDeliveryNotes() {
  //console.log('Watcher: watch DeliveryNote Active', getAllDeliveryNotes.type)
  yield takeLatest(getAllDeliveryNotes.type, getDeliveryNoteSaga)
}

function* watchCreateDeliveryNote() {
  // console.log('Watcher: watchCreateDeliveryNote Active', createDeliveryNote.type)
  yield takeLatest(createDeliveryNote.type, createDeliveryNoteSaga)
}

function* watchUpdateDeliveryNote() {
  // console.log('Watcher: watchUpdateDeliveryNote Active', updateDeliveryNote.type)
  yield takeLatest(updateDeliveryNote.type, updateDeliveryNoteSaga)
}

function* watchDeleteDeliveryNote() {
  //console.log('Watcher: watchDeleteDeliveryNote Active', deleteDeliveryNote.type)
  yield takeLatest(deleteDeliveryNote.type, deleteDeliveryNoteSaga)
}

// ================= ROOT BRANCH SAGA =================

export function* deliveryNotesSaga() {
  yield all([
    fork(watchGetDeliveryNotes),
    fork(watchCreateDeliveryNote),
    fork(watchUpdateDeliveryNote),
    fork(watchDeleteDeliveryNote),
  ])
}
