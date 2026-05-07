import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  result: [],
  totalCount: 0,
  selectedQuotation: { id: 0, name: '' },
  isLoading: false,
}

const quotationSlice = createSlice({
  name: 'quotations',
  initialState,
  reducers: {
    getAllQuotations: (state) => {
      state.isLoading = true
    },
    createQuotation: (state) => {
      state.isLoading = true
    },
    updateQuotation: (state) => {
      state.isLoading = true
    },
    deleteQuotation: (state) => {
      state.isLoading = true
    },

    setAllQuotations: (state, action) => {
      state.result = action.payload.data?.items || []
      state.totalCount = action.payload.data?.totalCount || 0
      state.isLoading = false
    },
    setQuotation: (state, action) => {
      state.selectedQuotation = action.payload
    },
    createQuotationCompleted: (state, action) => {
      state.result.unshift(action.payload)
      state.isLoading = false
    },
    updateQuotationCompleted: (state, action) => {
      const index = state.result.findIndex((x) => x.id === action.payload.id)
      if (index !== -1) state.result[index] = action.payload
      state.isLoading = false
    },
    deleteQuotationCompleted: (state, action) => {
      state.result = state.result.filter((x) => x.id !== action.payload)
      state.isLoading = false
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  getAllQuotations,
  setAllQuotations,
  setQuotation,
  createQuotation,
  updateQuotation,
  deleteQuotation,
  createQuotationCompleted,
  updateQuotationCompleted,
  deleteQuotationCompleted,
  setIsLoading,
} = quotationSlice.actions

export default quotationSlice.reducer
