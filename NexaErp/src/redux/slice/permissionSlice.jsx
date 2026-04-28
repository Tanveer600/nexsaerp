import { createSlice } from '@reduxjs/toolkit'
const initialState = {
  result: [],
  selectedPermission: { id: 0, name: '' },
  isLoading: false,
}

const permissionSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    getAllPermissions: (state) => {
      state.isLoading = true
    },
    createPermission: (state) => {
      state.isLoading = true
    },
    updatePermission: (state) => {
      state.isLoading = true
    },
    deletePermission: (state) => {
      state.isLoading = true
    },

    setAllPermissions: (state, action) => {
      state.result = action.payload || []
      state.isLoading = false
    },
    setPermission: (state, action) => {
      state.selectedPermission = action.payload
    },
    createPermissionCompleted: (state, action) => {
      state.result.unshift(action.payload)
      state.isLoading = false
    },
    updatePermissionCompleted: (state, action) => {
      const index = state.result.findIndex((x) => x.id === action.payload.id)
      if (index !== -1) state.result[index] = action.payload
      state.isLoading = false
    },
    deletePermissionCompleted: (state, action) => {
      state.result = state.result.filter((x) => x.id !== action.payload)
      state.isLoading = false
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  getAllPermissions,
  setAllPermissions,
  setPermission,
  createPermission,
  updatePermission,
  deletePermission,
  createPermissionCompleted,
  updatePermissionCompleted,
  deletePermissionCompleted,
  setIsLoading,
} = permissionSlice.actions

export default permissionSlice.reducer
