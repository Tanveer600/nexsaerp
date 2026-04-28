import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import branchService from '../services/branchService'
import {
  getAllBranches,
  setAllBranches,
  createBranch,
  deleteBranch,
  updateBranch,
  createBranchCompleted,
  updateBranchCompleted,
  deleteBranchCompleted,
  setIsLoading,
} from '../slice/branchSlice'

// ================= WORKER SAGAS =================

function* getbranchSaga() {
  //console.log('>>> Saga: getBranchesSaga Triggered')
  try {
    const data = yield call(branchService.getAll)
    console.log('>>> Saga: getBranchesSaga Success Data:', data)
    yield put(setAllBranches(data))
  } catch (e) {
    console.error('>>> Saga: Get Branches Error:', e)
    yield put(setAllBranches([]))
  }
}

function* createBranchSaga(action) {
  //console.log('>>> Saga: createBranchSaga Triggered with:', action.payload)
  try {
    const res = yield call(branchService.create, action.payload)
    console.log('>>> Saga: createBranchSaga Success Response:', res)
    yield put(createBranchCompleted(res))
    yield put(getAllBranches())
  } catch (e) {
    console.error('>>> Saga: Create Branch Error:', e)
    yield put(setIsLoading(false))
  }
}

function* updateBranchSaga(action) {
  //console.log('>>> Saga: updateBranchSaga Triggered with:', action.payload)
  try {
    const res = yield call(branchService.update, action.payload)
    console.log('>>> Saga: updateBranchSaga Success Response:', res)
    yield put(updateBranchCompleted(res))
    yield put(getAllBranches())
  } catch (e) {
    console.error('>>> Saga: Update Branch Error:', e)
    yield put(setIsLoading(false))
  }
}

function* deleteBranchSaga(action) {
  //console.log('>>> Saga: deleteBranch Saga Triggered for ID:', action.payload)
  try {
    yield call(branchService.delete, action.payload)
    console.log('>>> Saga: deleteBranchSaga Delete Successful')
    yield put(deleteBranchCompleted(action.payload))
    yield put(getAllBranches())
  } catch (e) {
    console.error('>>> Saga: Delete Branch Error:', e)
    yield put(setIsLoading(false))
  }
}

// ================= WATCHER SAGAS =================

function* watchGetBranches() {
  // console.log('Watcher: watchGetBranches Active', getAllBranches.type)
  yield takeLatest(getAllBranches.type, getbranchSaga)
}

function* watchCreateBranch() {
  //console.log('Watcher: watchCreateBranch Active', createBranch.type)
  yield takeLatest(createBranch.type, createBranchSaga)
}

function* watchUpdateBranch() {
  //console.log('Watcher: watchUpdateBranch Active', updateBranch.type)
  yield takeLatest(updateBranch.type, updateBranchSaga)
}

function* watchDeleteBranch() {
  //console.log('Watcher: watchDeleteBranch Active', deleteBranch.type)
  yield takeLatest(deleteBranch.type, deleteBranchSaga)
}

// ================= ROOT BRANCH SAGA =================

export function* branchSaga() {
  yield all([
    fork(watchGetBranches),
    fork(watchCreateBranch),
    fork(watchUpdateBranch),
    fork(watchDeleteBranch),
  ])
}
