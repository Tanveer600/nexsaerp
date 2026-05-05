import { all, call, fork, put, takeLatest } from 'redux-saga/effects'
import emailService from '../services/emailService'
import {
  fetchInbox,
  setInbox,
  sendEmail,
  sendEmailCompleted,
  syncInbox,
  syncInboxCompleted,
  setEmailError,
  setIsLoading,
} from '../slice/emailSlice'

function* fetchInboxSaga() {
  try {
    // Ab 'action.payload' (tenantId) bhejne ki zaroorat nahi
    const data = yield call(emailService.getInbox)
    console.log('>>> Saga: fetchInboxSaga Success:', data)
    yield put(setInbox(data))
  } catch (e) {
    console.error('>>> Saga: Fetch Inbox Error:', e)
    yield put(setEmailError(e.message))
    yield put(setInbox([]))
  }
}

function* sendEmailSaga(action) {
  try {
    const res = yield call(emailService.sendEmail, action.payload)
    console.log('>>> Saga: sendEmailSaga Success:', res)
    yield put(sendEmailCompleted(res))
  } catch (e) {
    console.error('>>> Saga: Send Email Error:', e)
    yield put(setEmailError(e.message))
    yield put(setIsLoading(false))
  }
}

function* syncInboxSaga(action) {
  try {
    // action.payload mein sirf { email, appPassword } hoga
    const res = yield call(emailService.syncInbox, action.payload)
    console.log('>>> Saga: syncInboxSaga Success:', res)

    yield put(syncInboxCompleted(res))

    // Refresh list: Ab fetchInbox mein kuch pass nahi karna
    yield put(fetchInbox())
  } catch (e) {
    console.error('>>> Saga: Sync Inbox Error:', e)
    yield put(setEmailError(e.message))
    yield put(setIsLoading(false))
  }
}

function* watchFetchInbox() {
  yield takeLatest(fetchInbox.type, fetchInboxSaga)
}

function* watchSendEmail() {
  yield takeLatest(sendEmail.type, sendEmailSaga)
}

function* watchSyncInbox() {
  yield takeLatest(syncInbox.type, syncInboxSaga)
}

export function* emailSaga() {
  yield all([fork(watchFetchInbox), fork(watchSendEmail), fork(watchSyncInbox)])
}
