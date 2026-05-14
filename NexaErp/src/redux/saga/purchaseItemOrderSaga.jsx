import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import purchaseOrderItemService from '../services/purchaseOrderItemService'
import {
  getAllPurchaseOrderItems,
  setAllPurchaseOrderItems,
  createPurchaseOrderItem,
  setPurchaseList,
  getPurchaseList,
  deletePurchaseOrderItem,
  updatePurchaseOrderItem,
  createPurchaseOrderItemCompleted,
  updatePurchaseOrderItemCompleted,
  deletePurchaseOrderItemCompleted,
  setIsLoading,
} from '../slice/purchaseOrdertemSlice'

// ================= WORKER SAGAS =================

function* getPurchaseOrderItemsSaga(action) {
  try {
    const data = yield call(purchaseOrderItemService.getAll, action.payload)
    yield put(setAllPurchaseOrderItems(data))
  } catch (e) {
    yield put(setAllPurchaseOrderItems({ items: [], totalCount: 0 }))
  }
}
function* getPurchaseListSaga() {
  try {
    const data = yield call(purchaseOrderItemService.getList)
    console.log('>>> Saga: setPurchaseListsaga Success Response:', data)
    yield put(setPurchaseList(data))
  } catch (e) {
    yield put(setPurchaseList([]))
  }
}
function* createPurchaseOrderItemSaga(action) {
  //console.log('>>> Saga: createPurchaseOrderItemSaga Triggered with:', action.payload)
  try {
    const res = yield call(purchaseOrderItemService.create, action.payload)
    console.log('>>> Saga: createPurchaseOrderItemSaga Success Response:', res)
    yield put(createPurchaseOrderItemCompleted(res))
    yield put(getAllPurchaseOrderItems())
  } catch (e) {
    console.error('FULL ERROR:', e)
    console.error('RESPONSE:', e?.response?.data)
    yield put(setIsLoading(false))
  }
}

function* updatePurchaseOrderItemSaga(action) {
  //console.log('>>> Saga: updatePurchaseOrderItemSaga Triggered with:', action.payload)
  try {
    const res = yield call(purchaseOrderItemService.update, action.payload)
    console.log('>>> Saga: updatePurchaseOrderItemSaga Success Response:', res)
    yield put(updatePurchaseOrderItemCompleted(res))
    yield put(getAllPurchaseOrderItems())
  } catch (e) {
    console.error('>>> Saga: Update Purchase Order Item Error:', e)
    yield put(setIsLoading(false))
  }
}

function* deletePurchaseOrderItemSaga(action) {
  //console.log('>>> Saga: deletePurchaseOrderItemSaga Triggered for ID:', action.payload)
  try {
    yield call(purchaseOrderItemService.delete, action.payload)
    console.log('>>> Saga: deletePurchaseOrderItemSaga Delete Successful')
    yield put(deletePurchaseOrderItemCompleted(action.payload))
    yield put(getAllPurchaseOrderItems())
  } catch (e) {
    console.error('>>> Saga: Delete Purchase Order Item Error:', e)
    yield put(setIsLoading(false))
  }
}

// ================= WATCHER SAGAS =================

function* watchGetPurchaseOrderItems() {
  // console.log('Watcher: watchGetPurchaseOrderItems Active', getAllPurchaseOrderItems.type)
  yield takeLatest(getAllPurchaseOrderItems.type, getPurchaseOrderItemsSaga)
}
function* watchGetPurchaseList() {
  //console.log('Watcher: watchGetProductList Active', getProductList.type)
  yield takeLatest(getPurchaseList.type, getPurchaseListSaga)
}
function* watchCreatePurchaseOrderItem() {
  //console.log('Watcher: watchCreatePurchaseOrderItem Active', createPurchaseOrderItem.type)
  yield takeLatest(createPurchaseOrderItem.type, createPurchaseOrderItemSaga)
}

function* watchUpdatePurchaseOrderItem() {
  //console.log('Watcher: watchUpdatePurchaseOrderItem Active', updatePurchaseOrderItem.type)
  yield takeLatest(updatePurchaseOrderItem.type, updatePurchaseOrderItemSaga)
}

function* watchDeletePurchaseOrderItem() {
  //console.log('Watcher: watchDeletePurchaseOrderItem Active', deletePurchaseOrderItem.type)
  yield takeLatest(deletePurchaseOrderItem.type, deletePurchaseOrderItemSaga)
}

// ================= ROOT BRANCH SAGA =================

export function* purchaseItemOrderSaga() {
  yield all([
    fork(watchGetPurchaseOrderItems),
    fork(watchCreatePurchaseOrderItem),
    fork(watchUpdatePurchaseOrderItem),
    fork(watchDeletePurchaseOrderItem),
    fork(watchGetPurchaseList),
  ])
}
