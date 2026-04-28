import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import permissionService from '../services/permissionService'
import {
  getAllPermissions,
  setAllPermissions,
  createPermission,
  createPermissionCompleted,
  updatePermission,
  updatePermissionCompleted,
  deletePermission,
  deletePermissionCompleted,
  setIsLoading,
} from '../slice/permissionSlice'

// ================= WORKER SAGAS =================

function* getPermissionsSaga() {
  //console.log('>>> Saga: getPermissionsSaga Triggered')
  try {
    const data = yield call(permissionService.getAll)
    //console.log('>>> Saga: getPermissionsSaga Success Data:', data)
    yield put(setAllPermissions(data))
  } catch (e) {
    console.error('>>> Saga: Get Permissions Error:', e)
    yield put(setAllPermissions([]))
  }
}

function* createPermissionSaga(action) {
  //console.log('>>> Saga: createPermissionSaga Triggered with:', action.payload)
  try {
    const res = yield call(permissionService.create, action.payload)
    console.log('>>> Saga: createPermissionSaga Success Response:', res)
    yield put(createPermissionCompleted(res))
    yield put(getAllPermissions())
  } catch (e) {
    console.error('>>> Saga: Create Permission Error:', e)
    yield put(setIsLoading(false))
  }
}

function* updatePermissionSaga(action) {
  //console.log('>>> Saga: updatePermissionSaga Triggered with:', action.payload)
  try {
    const res = yield call(permissionService.update, action.payload)
    console.log('>>> Saga: updatePermissionSaga Success Response:', res)
    yield put(updatePermissionCompleted(res))
    yield put(getAllPermissions())
  } catch (e) {
    console.error('>>> Saga: Update Permission Error:', e)
    yield put(setIsLoading(false))
  }
}

function* deletePermissionSaga(action) {
  //console.log('>>> Saga: deletePermissionSaga Triggered for ID:', action.payload)
  try {
    yield call(permissionService.delete, action.payload)
    console.log('>>> Saga: deletePermissionSaga Delete Successful')
    yield put(deletePermissionCompleted(action.payload))
    yield put(getAllPermissions())
  } catch (e) {
    console.error('>>> Saga: Delete Permission Error:', e)
    yield put(setIsLoading(false))
  }
}

// ================= WATCHER SAGAS =================

function* watchGetPermissions() {
  //console.log('Watcher: watchGetPermissions Active', getAllPermissions.type)
  yield takeLatest(getAllPermissions.type, getPermissionsSaga)
}

function* watchCreatePermission() {
  //console.log('Watcher: watchCreatePermission Active', createPermission.type)
  yield takeLatest(createPermission.type, createPermissionSaga)
}

function* watchUpdatePermission() {
  //console.log('Watcher: watchUpdatePermission Active', updatePermission.type)
  yield takeLatest(updatePermission.type, updatePermissionSaga)
}

function* watchDeletePermission() {
  //console.log('Watcher: watchDeletePermission Active', deletePermission.type)
  yield takeLatest(deletePermission.type, deletePermissionSaga)
}

// ================= ROOT PERMISSION SAGA =================

export function* permissionSaga() {
  yield all([
    fork(watchGetPermissions),
    fork(watchCreatePermission),
    fork(watchUpdatePermission),
    fork(watchDeletePermission),
  ])
}
