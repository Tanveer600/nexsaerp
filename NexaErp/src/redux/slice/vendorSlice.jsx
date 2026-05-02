import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  result: [], // Ismein items ayenge
  totalCount: 0, // Pagination ke liye
  selectedVendor: { id: 0, name: '' },
  dropdownList: [], // Dropdown ke liye simple list
  isLoading: false,
}

const vendorSlice = createSlice({
  name: 'vendors',
  initialState,
  reducers: {
    getAllVendors: (state) => {
      state.isLoading = true
    },
    getVendorList: (state) => {
      state.isLoading = true
    },
    setVendorList: (state, action) => {
      state.dropdownList = action.payload || []
    },
    createVendor: (state) => {
      state.isLoading = true
    },
    updateVendor: (state) => {
      state.isLoading = true
    },
    deleteVendor: (state) => {
      state.isLoading = true
    },

    setAllVendors: (state, action) => {
      state.result = action.payload.items || []
      state.totalCount = action.payload.totalCount || 0
      state.isLoading = false
    },
    setVendor: (state, action) => {
      state.selectedVendor = action.payload
    },
    createVendorCompleted: (state, action) => {
      state.result.unshift(action.payload)
      state.isLoading = false
    },
    updateVendorCompleted: (state, action) => {
      const index = state.result.findIndex((x) => x.id === action.payload.id)
      if (index !== -1) state.result[index] = action.payload
      state.isLoading = false
    },
    deleteVendorCompleted: (state, action) => {
      state.result = state.result.filter((x) => x.id !== action.payload)
      state.isLoading = false
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  getAllVendors,
  setAllVendors,
  setVendor,
  getVendorList,
  setVendorList,
  createVendor,
  updateVendor,
  deleteVendor,
  createVendorCompleted,
  updateVendorCompleted,
  deleteVendorCompleted,
  setIsLoading,
} = vendorSlice.actions

export default vendorSlice.reducer
