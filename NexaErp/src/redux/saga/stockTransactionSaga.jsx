import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import transactionService from '../services/stockTransactionService'
import {
  getAllStockTransaction,
  setAllStockTransactions,
  setStockTransaction,
  createStockTransaction,
  updateStockTransaction,
  deleteStockTransaction,
  createStockTransactionCompleted,
  updateStockTransactionCompleted,
  deleteStockTransactionCompleted,
  setIsLoading,
} from '../slice/stockTransactionSlice'
import { func } from 'prop-types'

// ================= WORKER SAGAS =================

function* getTransactionSaga(action) {
  try {
    const data = yield call(transactionService.getAll, action.payload)
    yield put(setAllStockTransactions(data))
  } catch (e) {
    yield put(setAllStockTransactions({ items: [], totalCount: 0 }))
  }
}
// function* getProductListSaga() {
//   try {
//     const data = yield call(transactionService.getList)
//     console.log('>>> Saga: getProductListSaga Success Response:', data)
//     yield put(setProductList(data))
//   } catch (e) {
//     yield put(setProductList([]))
//   }
// }
function* createTransactionSaga(action) {
  //console.log('>>> Saga: createProductSaga Triggered with:', action.payload)
  try {
    const res = yield call(transactionService.create, action.payload)
    console.log('>>> Saga: createtransactionSaga Success Response:', res)
    yield put(createStockTransactionCompleted(res))
    yield put(getAllStockTransaction())
  } catch (e) {
    console.error('>>> Saga: Create StockTransaction Error:', e)
    yield put(setIsLoading(false))
  }
}

// function* updatetransactionSaga(action) {
//   //console.log('>>> Saga: updateProductSaga Triggered with:', action.payload)
//   try {
//     const res = yield call(transactionService.update, action.payload)
//     //console.log('>>> Saga: updateProductSaga Success Response:', res)
//     yield put(updateProductCompleted(res))
//     yield put(getAllProducts())
//   } catch (e) {
//     console.error('>>> Saga: Update StockTransaction  Error:', e)
//     yield put(setIsLoading(false))
//   }
// }

function* deleteTransactionSaga(action) {
  //console.log('>>> Saga: deleteProductSaga Triggered for ID:', action.payload)
  try {
    yield call(transactionService.delete, action.payload)
    console.log('>>> Saga: deletetransactionSaga Delete Successful')
    yield put(deleteStockTransactionCompleted(action.payload))
    yield put(getAllStockTransaction())
  } catch (e) {
    console.error('>>> Saga: Delete StockTransaction Error:', e)
    yield put(setIsLoading(false))
  }
}

// ================= WATCHER SAGAS =================

function* watchGetTransactions() {
  // console.log('Watcher: watchGetProducts Active', getAllProducts.type)
  yield takeLatest(getAllStockTransaction.type, getTransactionSaga)
}

function* watchCreateTransaction() {
  //console.log('Watcher: watchCreatetransaction Active', createProduct.type)
  yield takeLatest(createStockTransaction.type, createTransactionSaga)
}

function* watchDeleteTransaction() {
  //console.log('Watcher: watchDeleteProduct Active', deleteProduct.type)
  yield takeLatest(deleteStockTransaction.type, deleteTransactionSaga)
}

// ================= ROOT BRANCH SAGA =================

export function* stockTransactionSaga() {
  yield all([
    fork(watchCreateTransaction),
    fork(watchDeleteTransaction),
    fork(watchGetTransactions),
  ])
}
