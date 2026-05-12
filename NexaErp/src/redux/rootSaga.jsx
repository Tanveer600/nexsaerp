import { all, fork } from 'redux-saga/effects'
import { tenantSaga } from './saga/tenantSaga'
import { userSaga } from './saga/userSaga'
import { branchSaga } from './saga/branchSaga'
import { roleSaga } from './saga/roleSaga'
import { companySaga } from './saga/companySaga'
import { permissionSaga } from './saga/permissionSaga'
import { menuSaga } from './saga/menuSaga'
import { roleMenuPermissionSaga } from './saga/roleMenuPermissionSaga'
import { customerSaga } from './saga/customerSaga'
import { productSaga } from './saga/productSaga'
import { vendorSaga } from './saga/vendorSaga'
import { purchaseItemOrderSaga } from './saga/purchaseItemOrderSaga'
import { employeeSaga } from './saga/employeeSaga'
import { emailSaga } from './saga/emailSaga'
import { quotationSaga } from './saga/quotationSaga'
import { saleSaga } from './saga/saleSaga'
import { deliveryNotesSaga } from './saga/deliveryNotesSaga'
import { stockTransactionSaga } from './saga/stockTransactionSaga'
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
    fork(customerSaga),
    fork(productSaga),
    fork(vendorSaga),
    fork(purchaseItemOrderSaga),
    fork(employeeSaga),
    fork(emailSaga),
    fork(quotationSaga),
    fork(saleSaga),
    fork(deliveryNotesSaga),
    fork(stockTransactionSaga),
  ])
}
