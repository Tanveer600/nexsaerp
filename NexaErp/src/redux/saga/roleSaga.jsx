import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import roleService from '../services/roleService'
import {
  getAllRoles,
  setAllRoles,
  createRole,
  createRoleCompleted,
  updateRole,
  updateRoleCompleted,
  deleteRole,
  deleteRoleCompleted,
  setIsLoading,
} from '../slice/roleSlice'
import { getAllTenants } from '../slice/tenantSlice'

// ================= WORKER SAGAS =================

function* getRolesSaga() {
  //console.log('>>> Saga: getRolesSaga Triggered')
  try {
    const data = yield call(roleService.getAll)
    //console.log('>>> Saga: getTenantsSaga Success Data:', data)
    yield put(setAllRoles(data))
  } catch (e) {
    console.error('>>> Saga: Get Role Error:', e)
    yield put(setAllRoles([]))
  }
}

function* createRoleSaga(action) {
  //console.log('>>> Saga: createRoleSaga Triggered with:', action.payload)
  try {
    const res = yield call(roleService.create, action.payload)
    //console.log('>>> Saga: createRoleSaga Success Response:', res)
    yield put(createRoleCompleted(res))
    yield put(getAllRoles())
  } catch (e) {
    console.error('>>> Saga: Create Role Error:', e)
    yield put(setIsLoading(false))
  }
}

function* updateRoleSaga(action) {
  //console.log('>>> Saga: updateRoleSaga Triggered with:', action.payload)
  try {
    const res = yield call(roleService.update, action.payload)
    //console.log('>>> Saga: updateRoleSaga Success Response:', res)
    yield put(updateRoleCompleted(res))
    yield put(getAllTenants())
  } catch (e) {
    console.error('>>> Saga: Update Role Error:', e)
    yield put(setIsLoading(false))
  }
}

function* deleteRoleSaga(action) {
  //console.log('>>> Saga: deleteRoleSaga Triggered for ID:', action.payload)
  try {
    yield call(roleService.delete, action.payload)
    console.log('>>> Saga: deleteroleSaga Delete Successful')
    yield put(deleteRoleCompleted(action.payload))
    yield put(getAllRoles())
  } catch (e) {
    console.error('>>> Saga: Delete role Error:', e)
    yield put(setIsLoading(false))
  }
}

// ================= WATCHER SAGAS =================

function* watchGetRoles() {
  //  console.log('Watcher: watchGetRoles Active', getAllRoles.type)
  yield takeLatest(getAllRoles.type, getRolesSaga)
}

function* watchCreateRole() {
  // console.log('Watcher: watchCreateRole Active', createRole.type)
  yield takeLatest(createRole.type, createRoleSaga)
}

function* watchUpdateRole() {
  //console.log('Watcher: watchUpdateRole Active', updateRole.type)
  yield takeLatest(updateRole.type, updateRoleSaga)
}

function* watchDeleteRole() {
  //console.log('Watcher: watchDeleteRole Active', deleteRole.type)
  yield takeLatest(deleteRole.type, deleteRoleSaga)
}

// ================= ROOT TENANT SAGA =================

export function* roleSaga() {
  yield all([
    fork(watchGetRoles),
    fork(watchCreateRole),
    fork(watchUpdateRole),
    fork(watchDeleteRole),
  ])
}
