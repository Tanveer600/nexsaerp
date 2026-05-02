import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import vendorService from '../services/vendorService'
import {
  getAllVendors,
  setAllVendors,
  createVendor,
  getVendorList,
  setVendorList,
  deleteVendor,
  updateVendor,
  createVendorCompleted,
  updateVendorCompleted,
  deleteVendorCompleted,
  setIsLoading,
} from '../slice/vendorSlice'

// ================= WORKER SAGAS =================

function* getvendorSaga(action) {
  try {
    const data = yield call(vendorService.getAll, action.payload)
    console.log('>>> Saga: getvendorSaga Success Response:', data)
    yield put(setAllVendors(data))
  } catch (e) {
    yield put(setAllVendors({ items: [], totalCount: 0 }))
  }
}
function* getVendorListSaga() {
  try {
    const data = yield call(vendorService.getList)
    console.log('>>> Saga: getVendorListSaga Success Response:', data)
    yield put(setVendorList(data))
  } catch (e) {
    yield put(setVendorList([]))
  }
}
function* createVendorSaga(action) {
  console.log('>>> Saga: createVendorSaga Triggered with:', action.payload)
  try {
    const res = yield call(vendorService.create, action.payload)
    console.log('>>> Saga: createVendorSaga Success Response:', res)
    yield put(createVendorCompleted(res))
    yield put(getAllVendors())
  } catch (e) {
    console.error('>>> Saga: Create Vendor Error:', e)
    yield put(setIsLoading(false))
  }
}

function* updateVendorSaga(action) {
  //console.log('>>> Saga: updateVendorSaga Triggered with:', action.payload)
  try {
    const res = yield call(vendorService.update, action.payload)
    console.log('>>> Saga: updateVendorSaga Success Response:', res)
    yield put(updateVendorCompleted(res))
    yield put(getAllVendors())
  } catch (e) {
    console.error('>>> Saga: Update Vendor Error:', e)
    yield put(setIsLoading(false))
  }
}

function* deleteVendorSaga(action) {
  //console.log('>>> Saga: deleteVendorSaga Triggered for ID:', action.payload)
  try {
    yield call(vendorService.delete, action.payload)
    console.log('>>> Saga: deleteVendorSaga Delete Successful')
    yield put(deleteVendorCompleted(action.payload))
    yield put(getAllVendors())
  } catch (e) {
    console.error('>>> Saga: Delete Vendor Error:', e)
    yield put(setIsLoading(false))
  }
}

// ================= WATCHER SAGAS =================

function* watchGetVendors() {
  // console.log('Watcher: watchGetVendors Active', getAllVendors.type)
  yield takeLatest(getAllVendors.type, getvendorSaga)
}

function* watchCreateVendor() {
  //console.log('Watcher: watchCreateVendor Active', createVendor.type)
  yield takeLatest(createVendor.type, createVendorSaga)
}

function* watchGetVendorList() {
  // console.log('Watcher: watchGetVendorList Active', getVendorList.type)
  yield takeLatest(getVendorList.type, getVendorListSaga)
}
function* watchUpdateVendor() {
  //console.log('Watcher: watchUpdateVendor Active', updateVendor.type)
  yield takeLatest(updateVendor.type, updateVendorSaga)
}

function* watchDeleteVendor() {
  //console.log('Watcher: watchDeleteVendor Active', deleteVendor.type)
  yield takeLatest(deleteVendor.type, deleteVendorSaga)
}

// ================= ROOT BRANCH SAGA =================

export function* vendorSaga() {
  yield all([
    fork(watchGetVendors),
    fork(watchCreateVendor),
    fork(watchUpdateVendor),
    fork(watchDeleteVendor),
    fork(watchGetVendorList),
  ])
}
