import { combineReducers } from '@reduxjs/toolkit'
import tenantReducer from './tenantSlice'
import userReducer from './userSlice'
import uiReducer from './sidebarSlice'
import branchReducer from './branchSlice'
import roleReducer from './roleSlice'
import companyReducer from './companySlice'
import permissionReducer from './permissionSlice'
import menuReducer from './menuSlice'
import roleMenuPermissionReducer from './roleMenuPermissionSlice'
<<<<<<< Updated upstream

=======
import customerReducer from './customerSlice'
import employeeReducer from './employeeSlice'
>>>>>>> Stashed changes
const rootReducer = combineReducers({
  tenants: tenantReducer,
  users: userReducer,
  ui: uiReducer,
  branches: branchReducer,
  roles: roleReducer,
  companies: companyReducer,
  permissions: permissionReducer,
  menues: menuReducer,
  roleMenuPermissions: roleMenuPermissionReducer,
<<<<<<< Updated upstream
=======
  customers: customerReducer,
  employee: employeeReducer,
>>>>>>> Stashed changes
})

export default rootReducer
