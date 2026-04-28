import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  result: [],
  selectedRole: { id: 0, name: '' },
  isLoading: false,
}

const roleSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    getAllRoles: (state) => {
      state.isLoading = true
    },
    createRole: (state) => {
      state.isLoading = true
    },
    updateRole: (state) => {
      state.isLoading = true
    },
    deleteRole: (state) => {
      state.isLoading = true
    },

    setAllRoles: (state, action) => {
      state.result = action.payload || []
      state.isLoading = false
    },
    setRole: (state, action) => {
      state.selectedRole = action.payload
    },
    createRoleCompleted: (state, action) => {
      state.result.unshift(action.payload)
      state.isLoading = false
    },
    updateRoleCompleted: (state, action) => {
      const index = state.result.findIndex((x) => x.id === action.payload.id)
      if (index !== -1) state.result[index] = action.payload
      state.isLoading = false
    },
    deleteRoleCompleted: (state, action) => {
      state.result = state.result.filter((x) => x.id !== action.payload)
      state.isLoading = false
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  getAllRoles,
  setAllRoles,
  setRole,
  createRole,
  updateRole,
  deleteRole,
  createRoleCompleted,
  updateRoleCompleted,
  deleteRoleCompleted,
  setIsLoading,
} = roleSlice.actions

export default roleSlice.reducer
