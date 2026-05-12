import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  result: [], // Ismein items ayenge
  totalCount: 0, // Pagination ke liye
  selectedStockTransaction: {},
  dropdownList: [],
  isLoading: false,
}

const stockTransactionSlice = createSlice({
  name: 'sstockTransaction',
  initialState,
  reducers: {
    getAllStockTransaction: (state) => {
      state.isLoading = true
    },
    // getStockTransactionList: (state) => {
    //   state.isLoading = true
    // },
    // setStockTransactionList: (state, action) => {
    //   state.dropdownList = action.payload || []
    // },
    createStockTransaction: (state) => {
      state.isLoading = true
    },
    updateStockTransaction: (state) => {
      state.isLoading = true
    },
    deleteStockTransaction: (state) => {
      state.isLoading = true
    },

    setAllStockTransactions: (state, action) => {
      state.result = action.payload.items || []
      state.totalCount = action.payload.totalCount || 0
      state.isLoading = false
    },
    setStockTransaction: (state, action) => {
      state.selectedStockTransaction = action.payload
    },
    createStockTransactionCompleted: (state, action) => {
      state.result.unshift(action.payload)
      state.isLoading = false
    },
    updateStockTransactionCompleted: (state, action) => {
      const index = state.result.findIndex((x) => x.id === action.payload.id)
      if (index !== -1) state.result[index] = action.payload
      state.isLoading = false
    },
    deleteStockTransactionCompleted: (state, action) => {
      state.result = state.result.filter((x) => x.id !== action.payload)
      state.isLoading = false
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  getAllStockTransaction,
  setAllStockTransactions,
  setStockTransaction,
  createStockTransaction,
  updateStockTransaction,
  deleteStockTransaction,
  createStockTransactionCompleted,
  updateStockTransactionCompleted,
  deleteStockTransactionCompleted,
  setIsLoading,
} = stockTransactionSlice.actions

export default stockTransactionSlice.reducer
