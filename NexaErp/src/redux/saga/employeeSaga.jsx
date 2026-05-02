import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import employeeService from '../services/employeeService'
import {
  getAllEmployees,
  setAllEmployees,
  createEmployee,
  deleteEmployee,
  updateEmployee,
  createEmployeeCompleted,
  updateEmployeeCompleted,
  deleteEmployeeCompleted,
  setIsLoading,
} from '../slice/employeeSlice'

// ================= WORKER SAGAS =================

function* getemployeeSaga(action) {
  try {
    const data = yield call(employeeService.getAll, action.payload)
    yield put(setAllEmployees(data))
  } catch (e) {
    yield put(setAllEmployees({ items: [], totalCount: 0 }))
  }
}

function* createEmployeeSaga(action) {
  //console.log('>>> Saga: createEmployeeSaga Triggered with:', action.payload)
  try {
    const res = yield call(employeeService.create, action.payload)
    console.log('>>> Saga: createEmployeeSaga Success Response:', res)
    yield put(createEmployeeCompleted(res))
    yield put(getAllEmployees())
  } catch (e) {
    console.error('>>> Saga: Create Employee Error:', e)
    yield put(setIsLoading(false))
  }
}

function* updateEmployeeSaga(action) {
  //console.log('>>> Saga: updateEmployeeSaga Triggered with:', action.payload)
  try {
    const res = yield call(employeeService.update, action.payload)
    console.log('>>> Saga: updateEmployeeSaga Success Response:', res)
    yield put(updateEmployeeCompleted(res))
    yield put(getAllEmployees())
  } catch (e) {
    console.error('>>> Saga: Update Employee Error:', e)
    yield put(setIsLoading(false))
  }
}

function* deleteEmployeeSaga(action) {
  //console.log('>>> Saga: deleteEmployeeSaga Triggered for ID:', action.payload)
  try {
    yield call(employeeService.delete, action.payload)
    console.log('>>> Saga: deleteEmployeeSaga Delete Successful')
    yield put(deleteEmployeeCompleted(action.payload))
    yield put(getAllEmployees())
  } catch (e) {
    console.error('>>> Saga: Delete Employee Error:', e)
    yield put(setIsLoading(false))
  }
}

// ================= WATCHER SAGAS =================

function* watchGetEmployees() {
  // console.log('Watcher: watchGetEmployees Active', getAllEmployees.type)
  yield takeLatest(getAllEmployees.type, getemployeeSaga)
}

function* watchCreateEmployee() {
  //console.log('Watcher: watchCreateEmployee Active', createEmployee.type)
  yield takeLatest(createEmployee.type, createEmployeeSaga)
}

function* watchUpdateEmployee() {
  //console.log('Watcher: watchUpdateEmployee Active', updateEmployee.type)
  yield takeLatest(updateEmployee.type, updateEmployeeSaga)
}

function* watchDeleteEmployee() {
  //console.log('Watcher: watchDeleteEmployee Active', deleteEmployee.type)
  yield takeLatest(deleteEmployee.type, deleteEmployeeSaga)
}

// ================= ROOT BRANCH SAGA =================

export function* employeeSaga() {
  yield all([
    fork(watchGetEmployees),
    fork(watchCreateEmployee),
    fork(watchUpdateEmployee),
    fork(watchDeleteEmployee),
  ])
}
