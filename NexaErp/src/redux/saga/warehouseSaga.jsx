import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import warehouseService from '../services/warehouseService'
import {
  getAllWarehouses,
  setAllWarehouses,
  setWarehouse,
  setWarehouseList,
  getWarehouseList,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  createWarehouseCompleted,
  updateWarehouseCompleted,
  deleteWarehouseCompleted,
  setIsLoading,
} from '../slice/warehouseSlice'
import { func } from 'prop-types'

// ================= WORKER SAGAS =================

function* getWarehouseSaga(action) {
  try {
    const data = yield call(warehouseService.getAll, action.payload)
    yield put(setAllWarehouses(data))
  } catch (e) {
    yield put(setAllWarehouses({ items: [], totalCount: 0 }))
  }
}
function* getWarehouseListSaga() {
  try {
    const data = yield call(warehouseService.getList)
    //console.log('>>> Saga: getProductListSaga Success Response:', data)
    yield put(setWarehouseList(data))
  } catch (e) {
    yield put(setWarehouseList([]))
  }
}
function* createWarehouseSaga(action) {
  //console.log('>>> Saga: createProductSaga Triggered with:', action.payload)
  try {
    const res = yield call(warehouseService.create, action.payload)
    //console.log('>>> Saga: createProductSaga Success Response:', res)
    yield put(createWarehouseCompleted(res))
    yield put(getAllWarehouses())
  } catch (e) {
    console.error('>>> Saga: Create Product Error:', e)
    yield put(setIsLoading(false))
  }
}

function* updateWarehouseSaga(action) {
  //console.log('>>> Saga: updateProductSaga Triggered with:', action.payload)
  try {
    const res = yield call(warehouseService.update, action.payload)
    //console.log('>>> Saga: updateProductSaga Success Response:', res)
    yield put(updateWarehouseCompleted(res))
    yield put(getAllWarehouses())
  } catch (e) {
    console.error('>>> Saga: Update Product  Error:', e)
    yield put(setIsLoading(false))
  }
}

function* deleteWarehouseSaga(action) {
  //console.log('>>> Saga: deleteProductSaga Triggered for ID:', action.payload)
  try {
    yield call(warehouseService.delete, action.payload)
    console.log('>>> Saga: deletewarehouseSaga Delete Successful')
    yield put(deleteWarehouseCompleted(action.payload))
    yield put(getAllWarehouses())
  } catch (e) {
    console.error('>>> Saga: Delete Product Error:', e)
    yield put(setIsLoading(false))
  }
}

// ================= WATCHER SAGAS =================

function* watchGetWarehouses() {
  // console.log('Watcher: watchGetProducts Active', getAllProducts.type)
  yield takeLatest(getAllWarehouses.type, getWarehouseSaga)
}
function* watchGetWarehouseList() {
  //console.log('Watcher: watchGetProductList Active', getProductList.type)
  yield takeLatest(getWarehouseList.type, getWarehouseListSaga)
}
function* watchCreateWarehouse() {
  //console.log('Watcher: watchCreateProduct Active', createProduct.type)
  yield takeLatest(createWarehouse.type, createWarehouseSaga)
}

function* watchUpdateWarehouse() {
  //console.log('Watcher: watchUpdateProduct Active', updateProduct.type)
  yield takeLatest(updateWarehouse.type, updateWarehouseSaga)
}

function* watchDeleteWarehouse() {
  //console.log('Watcher: watchDeleteProduct Active', deleteProduct.type)
  yield takeLatest(deleteWarehouse.type, deleteWarehouseSaga)
}

// ================= ROOT BRANCH SAGA =================

export function* warehouseSaga() {
  yield all([
    fork(watchGetWarehouses),
    fork(watchCreateWarehouse),
    fork(watchUpdateWarehouse),
    fork(watchDeleteWarehouse),
    fork(watchGetWarehouseList),
  ])
}
