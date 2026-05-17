import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  result: [], // Ismein items ayenge
  totalCount: 0, // Pagination ke liye
  selectedInvoice: {},
  dropdownList: [],
  isLoading: false,
}

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    getAllInvoices: (state) => {
      state.isLoading = true
    },
    getInvoiceList: (state) => {
      state.isLoading = true
    },
    setInvoiceList: (state, action) => {
      state.dropdownList = action.payload || []
    },
    createInvoice: (state) => {
      state.isLoading = true
    },
    updateInvoice: (state) => {
      state.isLoading = true
    },
    deleteInvoice: (state) => {
      state.isLoading = true
    },

    setAllInvoices: (state, action) => {
      state.result = action.payload.items || []
      state.totalCount = action.payload.totalCount || 0
      state.isLoading = false
    },
    setInvoice: (state, action) => {
      state.selectedInvoice = action.payload
    },
    createInvoiceCompleted: (state, action) => {
      state.result.unshift(action.payload)
      state.isLoading = false
    },
    updateInvoiceCompleted: (state, action) => {
      const index = state.result.findIndex((x) => x.id === action.payload.id)
      if (index !== -1) state.result[index] = action.payload
      state.isLoading = false
    },
    deleteInvoiceCompleted: (state, action) => {
      state.result = state.result.filter((x) => x.id !== action.payload)
      state.isLoading = false
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  getAllInvoices,
  setAllInvoices,
  setInvoice,
  getInvoiceList,
  setInvoiceList,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  createInvoiceCompleted,
  updateInvoiceCompleted,
  deleteInvoiceCompleted,
  setIsLoading,
} = invoiceSlice.actions

export default invoiceSlice.reducer
