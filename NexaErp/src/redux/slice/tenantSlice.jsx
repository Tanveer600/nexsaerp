import { createSlice } from '@reduxjs/toolkit'
const initialState = {
  result: [],
  selectedTenant: { id: 0, name: '' },
  isLoading: false,
}

const tenantSlice = createSlice({
  name: 'tenants',
  initialState,
  reducers: {
    getAllTenants: (state) => {
      state.isLoading = true
    },
    createTenant: (state) => {
      state.isLoading = true
    },
    updateTenant: (state) => {
      state.isLoading = true
    },
    deleteTenant: (state) => {
      state.isLoading = true
    },

    setAllTenants: (state, action) => {
      state.result = action.payload || []
      state.isLoading = false
    },
    setTenant: (state, action) => {
      state.selectedTenant = action.payload
    },
    createTenantCompleted: (state, action) => {
      state.result.unshift(action.payload)
      state.isLoading = false
    },
    updateTenantCompleted: (state, action) => {
      const index = state.result.findIndex((x) => x.id === action.payload.id)
      if (index !== -1) state.result[index] = action.payload
      state.isLoading = false
    },
    deleteTenantCompleted: (state, action) => {
      state.result = state.result.filter((x) => x.id !== action.payload)
      state.isLoading = false
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  getAllTenants,
  setAllTenants,
  setTenant,
  createTenant,
  updateTenant,
  deleteTenant,
  createTenantCompleted,
  updateTenantCompleted,
  deleteTenantCompleted,
  setIsLoading,
} = tenantSlice.actions

export default tenantSlice.reducer
