import { all, fork } from 'redux-saga/effects'
import { tenantSaga } from './saga/tenantSaga'
import { userSaga } from './saga/userSaga'
import { branchSaga } from './saga/branchSaga'
import { roleSaga } from './saga/roleSaga'
import { companySaga } from './saga/companySaga'
import { permissionSaga } from './saga/permissionSaga'
import { menuSaga } from './saga/menuSaga'
import { roleMenuPermissionSaga } from './saga/roleMenuPermissionSaga'
<<<<<<< Updated upstream
=======
import { customerSaga } from './saga/customerSaga'
import { employeeSaga } from './saga/employeeSaga'
>>>>>>> Stashed changes
export default function* rootSaga() {
  yield all([
    fork(tenantSaga),
    fork(userSaga),
    fork(branchSaga),
    fork(roleSaga),
    fork(companySaga),
    fork(permissionSaga),
    fork(menuSaga),
    fork(roleMenuPermissionSaga),
<<<<<<< Updated upstream
=======
    fork(customerSaga),
    fork(employeeSaga),
>>>>>>> Stashed changes
  ])
}
