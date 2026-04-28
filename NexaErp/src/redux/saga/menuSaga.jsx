import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import menuService from '../services/menuService'
import {
  getAllMenus,
  setAllMenus,
  createMenu,
  getMenuByRole,
  createMenuCompleted,
  updateMenu,
  updateMenuCompleted,
  deleteMenu,
  deleteMenuCompleted,
  setIsLoading,
} from '../slice/menuSlice'

// ================= WORKER SAGAS =================

function* getMenusSaga() {
  //console.log('>>> Saga: getMenusSaga Triggered')
  try {
    const data = yield call(menuService.getAll)
    console.log('>>> Saga: getMenusSaga Success Data:', data)
    yield put(setAllMenus(data))
  } catch (e) {
    console.error('>>> Saga: Get Menus Error:', e)
    yield put(setAllMenus([]))
  }
}

function* createMenuSaga(action) {
  //console.log('>>> Saga: createMenuSaga Triggered with:', action.payload)
  try {
    const res = yield call(menuService.create, action.payload)
    console.log('>>> Saga: createMenuSaga Success Response:', res)
    yield put(createMenuCompleted(res))
    //yield put(getAllMenus())
  } catch (e) {
    console.error('>>> Saga: Create Menu Error:', e)
    yield put(setIsLoading(false))
  }
}

function* updateMenuSaga(action) {
  //console.log('>>> Saga: updateMenuSaga Triggered with:', action.payload)
  try {
    const res = yield call(menuService.update, action.payload)
    console.log('>>> Saga: updateMenuSaga Success Response:', res)
    yield put(updateMenuCompleted(res))
    yield put(getAllMenus())
  } catch (e) {
    console.error('>>> Saga: Update Menu  Error:', e)
    yield put(setIsLoading(false))
  }
}

function* deleteMenuSaga(action) {
  //console.log('>>> Saga: deleteMenuSaga Triggered for ID:', action.payload)
  try {
    yield call(menuService.delete, action.payload)
    console.log('>>> Saga: deleteMenuSaga Delete Successful')
    yield put(deleteMenuCompleted(action.payload))
    yield put(getAllMenus())
  } catch (e) {
    console.error('>>> Saga: Delete Menu Error:', e)
    yield put(setIsLoading(false))
  }
}
function* getMenusByRoleSaga(action) {
  try {
    const data = yield call(menuService.getMenusByRole, action.payload)
    yield put(setAllMenus(data))
  } catch (e) {
    console.error('>>> Saga: Get Menus by role Error:', e)
    yield put(setAllMenus([]))
  }
}
// ================= WATCHER SAGAS =================

function* watchGetMenus() {
  //console.log('Watcher: watchGetMenus Active', getAllMenus.type)
  yield takeLatest(getAllMenus.type, getMenusSaga)
}
function* watchGetMenusByRole() {
  yield takeLatest(getMenuByRole.type, getMenusByRoleSaga)
}
function* watchCreateMenu() {
  //console.log('Watcher: watchCreateMenu Active', createMenu.type)
  yield takeLatest(createMenu.type, createMenuSaga)
}

function* watchUpdateMenu() {
  //console.log('Watcher: watchUpdateMenu Active', updateMenu.type)
  yield takeLatest(updateMenu.type, updateMenuSaga)
}

function* watchDeleteMenu() {
  //console.log('Watcher: watchDeleteMenu Active', deleteMenu.type)
  yield takeLatest(deleteMenu.type, deleteMenuSaga)
}

export function* menuSaga() {
  yield all([
    fork(watchGetMenus),
    fork(watchGetMenusByRole),
    fork(watchCreateMenu),
    fork(watchUpdateMenu),
    fork(watchDeleteMenu),
  ])
}
