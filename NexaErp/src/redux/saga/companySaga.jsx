import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import companyService from '../services/companyService'
import {
  getCompany,
  getAllCompany,
  setProfile,
  getProfile,
  setIsLoading,
  setCompany,
  saveCompanyCompleted,
  saveProfileCompleted,
  saveCompany,
  saveProfile,
  setAllCompanyData,
} from '../slice/companySlice'

// --- Workers ---

function* getProfileWorker(action) {
  try {
    yield put(setIsLoading(true))
    const res = yield call(companyService.getProfile, action.payload)
    yield put(setProfile(res?.data || res))
  } catch (e) {
    yield put(setProfile({}))
  } finally {
    yield put(setIsLoading(false))
  }
}
function* getAllCompanySaga() {
  //console.log('>>> Saga: getAllCompanySaga Triggered')
  try {
    const data = yield call(companyService.getAll)
    console.log('>>> Saga: getAllCompanySaga Success Data:', data)
    yield put(setAllCompanyData(data))
  } catch (e) {
    console.error('>>> Saga: Get Companies Error:', e)
    yield put(setAllCompanyData([]))
  }
}
function* saveProfileWorker(action) {
  try {
    yield put(setIsLoading(true))
    // action.payload is FormData
    const res = yield call(companyService.saveOrUpdateProfile, action.payload)
    yield put(saveProfileCompleted(res?.data || res))
    alert('Profile updated successfully!')
  } catch (e) {
    console.error('Profile Save Error:', e)
  } finally {
    yield put(setIsLoading(false))
  }
}

function* getCompanyWorker(action) {
  try {
    yield put(setIsLoading(true))
    const res = yield call(companyService.getCompany, action.payload)
    yield put(setCompany(res?.data || res))
  } catch (e) {
    yield put(setCompany({}))
  } finally {
    yield put(setIsLoading(false))
  }
}

function* saveCompanyWorker(action) {
  try {
    yield put(setIsLoading(true))
    const res = yield call(companyService.saveOrUpdateCompany, action.payload)
    yield put(saveCompanyCompleted(res?.data || res))
    alert('Company updated successfully!')
  } catch (e) {
    console.error('Company Save Error:', e)
  } finally {
    yield put(setIsLoading(false))
  }
}

// --- Watchers ---
function* watchGetAllCompany() {
  // console.log('Watcher: watchGetAllCompany Active', getAllCompany.type)
  yield takeLatest(getAllCompany.type, getAllCompanySaga)
}
function* watchGetProfile() {
  yield takeLatest(getProfile.type, getProfileWorker)
}

function* watchSaveProfile() {
  yield takeLatest(saveProfile.type, saveProfileWorker)
}

function* watchGetCompany() {
  yield takeLatest(getCompany.type, getCompanyWorker)
}

function* watchSaveCompany() {
  yield takeLatest(saveCompany.type, saveCompanyWorker)
}

// --- Root Company Saga ---

export function* companySaga() {
  yield all([
    fork(watchGetProfile),
    fork(watchSaveProfile),
    fork(watchGetCompany),
    fork(watchSaveCompany),
    fork(watchGetAllCompany),
  ])
}
