import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import productService from '../services/productService'
import {
  getAllProducts,
  setAllProducts,
  createProduct,
  getProductList,
  setProductList,
  deleteProduct,
  updateProduct,
  createProductCompleted,
  updateProductCompleted,
  deleteProductCompleted,
  setIsLoading,
} from '../slice/productSlice'
import { func } from 'prop-types'

// ================= WORKER SAGAS =================

function* getProductSaga(action) {
  try {
    const data = yield call(productService.getAll, action.payload)
    yield put(setAllProducts(data))
  } catch (e) {
    yield put(setAllProducts({ items: [], totalCount: 0 }))
  }
}
function* getProductListSaga() {
  try {
    const data = yield call(productService.getList)
    console.log('>>> Saga: getProductListSaga Success Response:', data)
    yield put(setProductList(data))
  } catch (e) {
    yield put(setProductList([]))
  }
}
function* createProductSaga(action) {
  //console.log('>>> Saga: createProductSaga Triggered with:', action.payload)
  try {
    const res = yield call(productService.create, action.payload)
    console.log('>>> Saga: createProductSaga Success Response:', res)
    yield put(createProductCompleted(res))
    yield put(getAllProducts())
  } catch (e) {
    console.error('>>> Saga: Create Product Error:', e)
    yield put(setIsLoading(false))
  }
}

function* updateProductSaga(action) {
  //console.log('>>> Saga: updateProductSaga Triggered with:', action.payload)
  try {
    const res = yield call(productService.update, action.payload)
    //console.log('>>> Saga: updateProductSaga Success Response:', res)
    yield put(updateProductCompleted(res))
    yield put(getAllProducts())
  } catch (e) {
    console.error('>>> Saga: Update Product  Error:', e)
    yield put(setIsLoading(false))
  }
}

function* deleteProductSaga(action) {
  //console.log('>>> Saga: deleteProductSaga Triggered for ID:', action.payload)
  try {
    yield call(productService.delete, action.payload)
    console.log('>>> Saga: deleteProductSaga Delete Successful')
    yield put(deleteProductCompleted(action.payload))
    yield put(getAllProducts())
  } catch (e) {
    console.error('>>> Saga: Delete Product Error:', e)
    yield put(setIsLoading(false))
  }
}

// ================= WATCHER SAGAS =================

function* watchGetProducts() {
  // console.log('Watcher: watchGetProducts Active', getAllProducts.type)
  yield takeLatest(getAllProducts.type, getProductSaga)
}
function* watchGetProductList() {
  //console.log('Watcher: watchGetProductList Active', getProductList.type)
  yield takeLatest(getProductList.type, getProductListSaga)
}
function* watchCreateProduct() {
  //console.log('Watcher: watchCreateProduct Active', createProduct.type)
  yield takeLatest(createProduct.type, createProductSaga)
}

function* watchUpdateProduct() {
  //console.log('Watcher: watchUpdateProduct Active', updateProduct.type)
  yield takeLatest(updateProduct.type, updateProductSaga)
}

function* watchDeleteProduct() {
  //console.log('Watcher: watchDeleteProduct Active', deleteProduct.type)
  yield takeLatest(deleteProduct.type, deleteProductSaga)
}

// ================= ROOT BRANCH SAGA =================

export function* productSaga() {
  yield all([
    fork(watchGetProducts),
    fork(watchCreateProduct),
    fork(watchUpdateProduct),
    fork(watchDeleteProduct),
    fork(watchGetProductList),
  ])
}
