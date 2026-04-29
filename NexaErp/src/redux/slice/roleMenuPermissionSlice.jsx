import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  result: [], // Tamam assigned permissions ki list (Grid ke liye)
  rolePermissions: [], // Specific selected role ke assigned menus (Checkboxes ke liye)
  selectedRoleMenuPermission: { id: 0, roleId: 0, tenantId: 0 },
  isLoading: false,
}

const roleMenuPermissionSlice = createSlice({
  name: 'roleMenuPermissions',
  initialState,
  reducers: {
    // Saga ya Async Thunk ke liye triggers
    getAllRoleMenuPermissions: (state) => {
      state.isLoading = true
    },
    getPermissionsByRole: (state) => {
      state.isLoading = true
    },
    assignRoleMenuPermissions: (state) => {
      state.isLoading = true
    },
    deleteRoleMenuPermission: (state) => {
      state.isLoading = true
    },

    // Data setting reducers
    setAllRoleMenuPermissions: (state, action) => {
      state.result = action.payload || []
      state.isLoading = false
    },

    // Jab kisi Role ke menus API se aayein
    setRolePermissions: (state, action) => {
      state.rolePermissions = action.payload || []
      state.isLoading = false
    },

    setRoleMenuPermission: (state, action) => {
      state.selectedRoleMenuPermission = action.payload
    },

    // Jab Bulk Assign complete ho jaye
    assignRoleMenuPermissionsCompleted: (state) => {
      state.isLoading = false
      // Note: Bulk update ke baad aksar hum puri list dobara fetch karte hain
    },

    deleteRoleMenuPermissionCompleted: (state, action) => {
      state.result = state.result.filter((x) => x.id !== action.payload)
      state.isLoading = false
    },

    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  getAllRoleMenuPermissions,
  getPermissionsByRole,
  setAllRoleMenuPermissions,
  setRolePermissions,
  setRoleMenuPermission,
  assignRoleMenuPermissions,
  assignRoleMenuPermissionsCompleted,
  deleteRoleMenuPermission,
  deleteRoleMenuPermissionCompleted,
  setIsLoading,
} = roleMenuPermissionSlice.actions

export default roleMenuPermissionSlice.reducer
