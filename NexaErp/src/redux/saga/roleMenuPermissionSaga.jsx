import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import roleMenuPermissionService from '../services/roleMenuPermissionService'
import {
  getAllRoleMenuPermissions,
  setAllRoleMenuPermissions,
  getPermissionsByRole,
  setRolePermissions,
  assignRoleMenuPermissions,
  assignRoleMenuPermissionsCompleted,
  deleteRoleMenuPermission,
  deleteRoleMenuPermissionCompleted,
  setIsLoading,
} from '../slice/roleMenuPermissionSlice'

// ================= WORKER SAGAS =================

// 1. Tamam assigned permissions fetch karne ke liye
function* getRoleMenuPermissionsSaga() {
  try {
    const data = yield call(roleMenuPermissionService.getAll)
    yield put(setAllRoleMenuPermissions(data))
  } catch (e) {
    console.error('>>> Saga: Get All Permissions Error:', e)
    yield put(setAllRoleMenuPermissions([]))
  }
}

// 2. Specific Role ki permissions fetch karne ke liye (Edit Mode)
function* getPermissionsByRoleSaga(action) {
  try {
    const response = yield call(roleMenuPermissionService.getByRole, action.payload)
    // CHECK: Agar backend ResponseDataModel bhej raha hai, toh data 'response.result' ya 'response.data' mein hoga
    const finalData = response.result || response.data || response
    yield put(setRolePermissions(finalData))
  } catch (e) {
    yield put(setRolePermissions([]))
  }
}

// 3. Bulk Assign/Update (Smart Sync)
function* assignRoleMenuPermissionsSaga(action) {
  try {
    const res = yield call(roleMenuPermissionService.assignPermissions, action.payload)
    yield put(assignRoleMenuPermissionsCompleted(res))

    // Assign ke baad list refresh karna professional practice hai
    yield put(getAllRoleMenuPermissions())
  } catch (e) {
    console.error('FULL ERROR:', e.response?.data) // 🔥 IMPORTANT
    console.error('STATUS:', e.response?.status)
  }
  yield put(setIsLoading(false))
}

// 4. Single Delete
function* deleteRoleMenuPermissionSaga(action) {
  try {
    yield call(roleMenuPermissionService.delete, action.payload)
    yield put(deleteRoleMenuPermissionCompleted(action.payload))
    yield put(getAllRoleMenuPermissions())
  } catch (e) {
    console.error('>>> Saga: Delete Permission Error:', e)
    yield put(setIsLoading(false))
  }
}

// ================= WATCHER SAGAS =================

function* watchGetAll() {
  yield takeLatest(getAllRoleMenuPermissions.type, getRoleMenuPermissionsSaga)
}

function* watchGetByRole() {
  yield takeLatest(getPermissionsByRole.type, getPermissionsByRoleSaga)
}

function* watchAssign() {
  yield takeLatest(assignRoleMenuPermissions.type, assignRoleMenuPermissionsSaga)
}

function* watchDelete() {
  yield takeLatest(deleteRoleMenuPermission.type, deleteRoleMenuPermissionSaga)
}

// ================= ROOT SAGA =================

export function* roleMenuPermissionSaga() {
  yield all([fork(watchGetAll), fork(watchGetByRole), fork(watchAssign), fork(watchDelete)])
}
