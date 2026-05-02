import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  result: [], // Ismein items ayenge
  totalCount: 0, // Pagination ke liye
  selectedOrder: { id: 0, name: '' },
  isLoading: false,
}

const purchaseOrdertemSlice = createSlice({
  name: 'purchaseOrderItems',
  initialState,
  reducers: {
    getAllPurchaseOrderItems: (state) => {
      state.isLoading = true
    },
    createPurchaseOrderItem: (state) => {
      state.isLoading = true
    },
    updatePurchaseOrderItem: (state) => {
      state.isLoading = true
    },
    deletePurchaseOrderItem: (state) => {
      state.isLoading = true
    },

    setAllPurchaseOrderItems: (state, action) => {
      state.result = action.payload.data?.items || []
      state.totalCount = action.payload.data?.totalCount || 0
      state.isLoading = false
    },
    setPurchaseOrderItem: (state, action) => {
      state.selectedOrder = action.payload
    },
    createPurchaseOrderItemCompleted: (state, action) => {
      state.result.unshift(action.payload)
      state.isLoading = false
    },
    updatePurchaseOrderItemCompleted: (state, action) => {
      const index = state.result.findIndex((x) => x.id === action.payload.id)
      if (index !== -1) state.result[index] = action.payload
      state.isLoading = false
    },
    deletePurchaseOrderItemCompleted: (state, action) => {
      state.result = state.result.filter((x) => x.id !== action.payload)
      state.isLoading = false
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  getAllPurchaseOrderItems,
  setAllPurchaseOrderItems,
  setPurchaseOrderItem,
  createPurchaseOrderItem,
  updatePurchaseOrderItem,
  deletePurchaseOrderItem,
  createPurchaseOrderItemCompleted,
  updatePurchaseOrderItemCompleted,
  deletePurchaseOrderItemCompleted,
  setIsLoading,
} = purchaseOrdertemSlice.actions

export default purchaseOrdertemSlice.reducer
