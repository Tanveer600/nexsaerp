import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  result: [],
  totalCount: 0,
  selectedSale: { id: 0, name: '' },
  isLoading: false,
}

const saleSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    getAllSales: (state) => {
      state.isLoading = true
    },
    createSale: (state) => {
      state.isLoading = true
    },
    updateSale: (state) => {
      state.isLoading = true
    },
    deleteSale: (state) => {
      state.isLoading = true
    },

    setAllSales: (state, action) => {
      state.result = action.payload.data?.items || []
      state.totalCount = action.payload.data?.totalCount || 0
      state.isLoading = false
    },
    setSale: (state, action) => {
      state.selectedSale = action.payload
    },
    createSaleCompleted: (state, action) => {
      state.result.unshift(action.payload)
      state.isLoading = false
    },
    updateSaleCompleted: (state, action) => {
      const index = state.result.findIndex((x) => x.id === action.payload.id)
      if (index !== -1) state.result[index] = action.payload
      state.isLoading = false
    },
    deleteSaleCompleted: (state, action) => {
      state.result = state.result.filter((x) => x.id !== action.payload)
      state.isLoading = false
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  getAllSales,
  setAllSales,
  setSale,
  createSale,
  updateSale,
  deleteSale,
  createSaleCompleted,
  updateSaleCompleted,
  deleteSaleCompleted,
  setIsLoading,
} = saleSlice.actions

export default saleSlice.reducer
