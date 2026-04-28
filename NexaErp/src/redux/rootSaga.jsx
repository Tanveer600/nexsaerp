import { all, fork } from 'redux-saga/effects'
import { tenantSaga } from './saga/tenantSaga'
import { userSaga } from './saga/userSaga'
import { branchSaga } from './saga/branchSaga'
import { roleSaga } from './saga/roleSaga'
import { companySaga } from './saga/companySaga'
import { permissionSaga } from './saga/permissionSaga'
import { menuSaga } from './saga/menuSaga'
export default function* rootSaga() {
  yield all([
    fork(tenantSaga),
    fork(userSaga),
    fork(branchSaga),
    fork(roleSaga),
    fork(companySaga),
    fork(permissionSaga),
    fork(menuSaga),
  ])
}
