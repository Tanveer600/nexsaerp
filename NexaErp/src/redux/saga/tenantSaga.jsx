import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import tenantService from '../services/tenantService'
import { getAllTenants, setAllTenants,
  createTenant, createTenantCompleted,
  updateTenant, updateTenantCompleted,
  deleteTenant, deleteTenantCompleted,
  setIsLoading, } from '../slice/tenantSlice'

// ================= WORKER SAGAS =================

function* getTenantsSaga() {
  //console.log('>>> Saga: getTenantsSaga Triggered')
  try {
    const data = yield call(tenantService.getAll)
    //console.log('>>> Saga: getTenantsSaga Success Data:', data)
    yield put(setAllTenants(data))
  } catch (e) {
    console.error('>>> Saga: Get Tenants Error:', e)
    yield put(setAllTenants([]))
  }
}

function* createTenantSaga(action) {
  //console.log('>>> Saga: createTenantSaga Triggered with:', action.payload)
  try {
    const res = yield call(tenantService.create, action.payload)
    console.log('>>> Saga: createTenantSaga Success Response:', res)
    yield put(createTenantCompleted(res))
    yield put(getAllTenants()) 
  } catch (e) {
    console.error('>>> Saga: Create Tenant Error:', e)
    yield put(setIsLoading(false))
  }
}

function* updateTenantSaga(action) {
  //console.log('>>> Saga: updateTenantSaga Triggered with:', action.payload)
  try {
    const res = yield call(tenantService.update, action.payload)
    console.log('>>> Saga: updateTenantSaga Success Response:', res)
    yield put(updateTenantCompleted(res))
    yield put(getAllTenants()) 
  } catch (e) {
    console.error('>>> Saga: Update Tenant Error:', e)
    yield put(setIsLoading(false))
  }
}

function* deleteTenantSaga(action) {
  //console.log('>>> Saga: deleteTenantSaga Triggered for ID:', action.payload)
  try {
    yield call(tenantService.delete, action.payload)
    console.log('>>> Saga: deleteTenantSaga Delete Successful')
    yield put(deleteTenantCompleted(action.payload))
    yield put(getAllTenants()) 
  } catch (e) {
    console.error('>>> Saga: Delete Tenant Error:', e)
    yield put(setIsLoading(false))
  }
}

// ================= WATCHER SAGAS =================

function* watchGetTenants() {
  //console.log('Watcher: watchGetTenants Active', getAllTenants.type)
  yield takeLatest(getAllTenants.type, getTenantsSaga)
}

function* watchCreateTenant() {
  //console.log('Watcher: watchCreateTenant Active', createTenant.type)
  yield takeLatest(createTenant.type, createTenantSaga)
}

function* watchUpdateTenant() {
  //console.log('Watcher: watchUpdateTenant Active', updateTenant.type)
  yield takeLatest(updateTenant.type, updateTenantSaga)
}

function* watchDeleteTenant() {
  //console.log('Watcher: watchDeleteTenant Active', deleteTenant.type)
  yield takeLatest(deleteTenant.type, deleteTenantSaga)
}

// ================= ROOT TENANT SAGA =================

export function* tenantSaga() {
  yield all([
     fork(watchGetTenants),
    fork(watchCreateTenant),
    fork(watchUpdateTenant),
    fork(watchDeleteTenant),
  ])
}