import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  result: [],
  totalCount: 0,
  selectedVendorQuotation: { id: 0, name: '' },
  isLoading: false,
}

const vendorQuotationSlice = createSlice({
  name: 'vendorquotations',
  initialState,
  reducers: {
    getAllVendorQuotations: (state) => {
      state.isLoading = true
    },
    createVendorQuotation: (state) => {
      state.isLoading = true
    },
    approveVendorQuotation: (state) => {
      state.isLoading = true
    },
    updateVendorQuotation: (state) => {
      state.isLoading = true
    },
    deleteVendorQuotation: (state) => {
      state.isLoading = true
    },

    setAllVendorQuotations: (state, action) => {
      state.result = action.payload.data?.items || []
      state.totalCount = action.payload.data?.totalCount || 0
      state.isLoading = false
    },
    setVendorQuotation: (state, action) => {
      state.selectedVendorQuotation = action.payload
    },
    approveVendorQuotationCompleted: (state, action) => {
      const id = action.payload.id || action.payload.vendorquotationId
      const index = state.result.findIndex((x) => (x.id || x.vendorquotationId) === id)
      if (index !== -1) {
        state.result[index] = action.payload
      }
      state.isLoading = false
    },
    createVendorQuotationCompleted: (state, action) => {
      state.result.unshift(action.payload)
      state.isLoading = false
    },
    updatevendorQuotationCompleted: (state, action) => {
      const index = state.result.findIndex((x) => x.id === action.payload.id)
      if (index !== -1) state.result[index] = action.payload
      state.isLoading = false
    },
    deleteVendorQuotationCompleted: (state, action) => {
      state.result = state.result.filter((x) => x.id !== action.payload)
      state.isLoading = false
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  getAllVendorQuotations,
  setAllVendorQuotations,
  setVendorQuotation,
  createVendorQuotation,
  updateVendorQuotation,
  deleteVendorQuotation,
  approveVendorQuotation,
  approveVendorQuotationCompleted,
  createVendorQuotationCompleted,
  updatevendorQuotationCompleted,
  deleteVendorQuotationCompleted,
  setIsLoading,
} = vendorQuotationSlice.actions

export default vendorQuotationSlice.reducer
