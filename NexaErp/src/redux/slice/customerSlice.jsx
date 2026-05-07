import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  result: [], // Ismein items ayenge
  dropdownList: [],
  totalCount: 0, // Pagination ke liye
  selectedCustomer: { id: 0, name: '' },
  isLoading: false,
}

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    getAllCustomers: (state) => {
      state.isLoading = true
    },
    createCustomer: (state) => {
      state.isLoading = true
    },
    updateCustomer: (state) => {
      state.isLoading = true
    },
    deleteCustomer: (state) => {
      state.isLoading = true
    },
    getCustomerList: (state) => {
      state.isLoading = true
    },
    setCustomerList: (state, action) => {
      state.dropdownList = action.payload || []
    },
    setAllCustomers: (state, action) => {
      state.result = action.payload.items || []
      state.totalCount = action.payload.totalCount || 0
      state.isLoading = false
    },
    setCustomer: (state, action) => {
      state.selectedCustomer = action.payload
    },
    createCustomerCompleted: (state, action) => {
      state.result.unshift(action.payload)
      state.isLoading = false
    },
    updateCustomerCompleted: (state, action) => {
      const index = state.result.findIndex((x) => x.id === action.payload.id)
      if (index !== -1) state.result[index] = action.payload
      state.isLoading = false
    },
    deleteCustomerCompleted: (state, action) => {
      state.result = state.result.filter((x) => x.id !== action.payload)
      state.isLoading = false
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  getAllCustomers,
  setAllCustomers,
  setCustomer,
  getCustomerList,
  setCustomerList,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  createCustomerCompleted,
  updateCustomerCompleted,
  deleteCustomerCompleted,
  setIsLoading,
} = customerSlice.actions

export default customerSlice.reducer
