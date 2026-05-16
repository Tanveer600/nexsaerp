import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import categoriesService from '../services/categoriesService'
import {
  getAllCategories,
  setAllCategories,
  setCategorie,
  getCategorieList,
  setCategorieList,
  createCategorie,
  updateCategorie,
  deleteCategorie,
  createCategorieCompleted,
  updateCategorieCompleted,
  deleteCategorieCompleted,
  setIsLoading,
} from '../slice/categoriesSlice'
import { func } from 'prop-types'

// ================= WORKER SAGAS =================

function* getCategorieSaga(action) {
  try {
    const data = yield call(categoriesService.getAll, action.payload)
    yield put(setAllCategories(data))
  } catch (e) {
    yield put(setAllCategories({ items: [], totalCount: 0 }))
  }
}
function* getCategorieListSaga() {
  try {
    const data = yield call(categoriesService.getList)
    console.log('>>> Saga: getcategoryListSaga Success Response:', data)
    yield put(setCategorieList(data))
  } catch (e) {
    yield put(setCategorieList([]))
  }
}
function* createCategorieSaga(action) {
  //console.log('>>> Saga: createProductSaga Triggered with:', action.payload)
  try {
    const res = yield call(categoriesService.create, action.payload)
    console.log('>>> Saga: createProductSaga Success Response:', res)
    yield put(createCategorieCompleted(res))
    yield put(getAllCategories())
  } catch (e) {
    console.error('>>> Saga: Create category Error:', e)
    yield put(setIsLoading(false))
  }
}

function* updateCategorieSaga(action) {
  //console.log('>>> Saga: updateProductSaga Triggered with:', action.payload)
  try {
    const res = yield call(categoriesService.update, action.payload)
    //console.log('>>> Saga: updateProductSaga Success Response:', res)
    yield put(updateCategorieCompleted(res))
    yield put(getAllCategories())
  } catch (e) {
    console.error('>>> Saga: Update category  Error:', e)
    yield put(setIsLoading(false))
  }
}

function* deleteCategorieSaga(action) {
  //console.log('>>> Saga: deleteProductSaga Triggered for ID:', action.payload)
  try {
    yield call(categoriesService.delete, action.payload)
    console.log('>>> Saga: deleteCategorieSaga Delete Successful')
    yield put(deleteCategorieCompleted(action.payload))
    yield put(getAllCategories())
  } catch (e) {
    console.error('>>> Saga: Delete category Error:', e)
    yield put(setIsLoading(false))
  }
}

// ================= WATCHER SAGAS =================

function* watchGetCategories() {
  // console.log('Watcher: watchGetProducts Active', getAllProducts.type)
  yield takeLatest(getAllCategories.type, getCategorieSaga)
}
function* watchGetCategorieList() {
  //console.log('Watcher: watchGetProductList Active', getProductList.type)
  yield takeLatest(getCategorieList.type, getCategorieListSaga)
}
function* watchCreateCategorie() {
  //console.log('Watcher: watchCreateProduct Active', createProduct.type)
  yield takeLatest(createCategorie.type, createCategorieSaga)
}

function* watchUpdateCategorie() {
  //console.log('Watcher: watchUpdateProduct Active', updateProduct.type)
  yield takeLatest(updateCategorie.type, updateCategorieSaga)
}

function* watchDeleteCategorie() {
  //console.log('Watcher: watchDeleteProduct Active', deleteProduct.type)
  yield takeLatest(deleteCategorie.type, deleteCategorieSaga)
}

// ================= ROOT BRANCH SAGA =================

export function* categorieSaga() {
  yield all([
    fork(watchGetCategorieList),
    fork(watchCreateCategorie),
    fork(watchUpdateCategorie),
    fork(watchDeleteCategorie),
    fork(watchGetCategories),
  ])
}
