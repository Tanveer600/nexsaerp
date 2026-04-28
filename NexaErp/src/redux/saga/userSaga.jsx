import { all, call, fork, delay, put, takeLatest } from 'redux-saga/effects'

import userService from '../services/userService'
import {
  getAllUsers,
  setAllUsers,
  createUser,
  createUserCompleted,
  updateUser,
  updateUserCompleted,
  deleteUser,
  deleteUserCompleted,
  setIsLoading,
  loginFailure,
  loginRequest,
  loginSuccess,
  resetError,
} from '../slice/userSlice'

// ================= WORKER SAGAS =================

function* getUsersSaga() {
  try {
    const data = yield call(userService.getAll)
    console.log('>>> Saga: getUsersSaga Success Data:', data)
    yield put(setAllUsers(data))
  } catch (e) {
    console.error('>>> Saga: Get Users Error:', e)
    yield put(setAllUsers([]))
  }
}

function* createUserSaga(action) {
  try {
    const res = yield call(userService.create, action.payload)
    console.log('>>> Saga: createUserSaga Success Response:', res)
    yield put(createUserCompleted(res))
    yield put(getAllUsers())
  } catch (e) {
    console.error('>>> Saga: Create User Error:', e)
    yield put(setIsLoading(false))
  }
}

function* updateUserSaga(action) {
  try {
    const res = yield call(userService.update, action.payload)
    console.log('>>> Saga: updateUserSaga Success Response:', res)
    yield put(getAllUsers())
  } catch (e) {
    console.error('>>> Saga: Update User Error:', e)
    yield put(setIsLoading(false))
  }
}

function* deleteUserSaga(action) {
  try {
    yield call(userService.delete, action.payload)
    console.log('>>> Saga: deleteUserSaga Delete Successful')
    yield put(deleteUserCompleted(action.payload))
    yield put(getAllUsers())
  } catch (e) {
    console.error('>>> Saga: Delete User Error:', e)
    yield put(setIsLoading(false))
  }
}

function* loginSaga(action) {
  try {
    const res = yield call(userService.login, action.payload)
    yield delay(2000)
    if (res?.success) {
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data))
      yield put({ type: 'users/loginSuccess', payload: res.data })
    } else {
      yield put({
        type: 'users/loginFailure',
        payload: res?.message || 'Invalid Email or Password',
      })
    }
  } catch (e) {
    yield put({
      type: 'users/loginFailure',
      payload: e.response?.data?.message || e.message || 'Something went wrong',
    })
  }
}

function* watchGetUsers() {
  yield takeLatest(getAllUsers.type, getUsersSaga)
}

function* watchCreateUser() {
  yield takeLatest(createUser.type, createUserSaga)
}

function* watchUpdateUser() {
  yield takeLatest(updateUser.type, updateUserSaga)
}

function* watchDeleteUser() {
  yield takeLatest(deleteUser.type, deleteUserSaga)
}

function* watchLoginUser() {
  yield takeLatest('users/loginUser', loginSaga)
}

// ================= ROOT USER SAGA =================

export function* userSaga() {
  yield all([
    fork(watchGetUsers),
    fork(watchCreateUser),
    fork(watchUpdateUser),
    fork(watchDeleteUser),
    fork(watchLoginUser),
  ])
}
