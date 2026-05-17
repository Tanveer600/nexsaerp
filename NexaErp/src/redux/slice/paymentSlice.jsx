import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  result: [],
  totalCount: 0,
  selectedPayment: {},
  dropdownList: [],
  isLoading: false,
}

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    getAllPayments: (state) => {
      state.isLoading = true
    },
    getPaymentList: (state) => {
      state.isLoading = true
    },
    setPaymentList: (state, action) => {
      state.dropdownList = action.payload || []
    },
    createPayment: (state) => {
      state.isLoading = true
    },
    updatePayment: (state) => {
      state.isLoading = true
    },
    deletePayment: (state) => {
      state.isLoading = true
    },

    setAllPayments: (state, action) => {
      state.result = action.payload.items || []
      state.totalCount = action.payload.totalCount || 0
      state.isLoading = false
    },
    setPayment: (state, action) => {
      state.selectedPayment = action.payload
    },
    createPaymentCompleted: (state, action) => {
      state.result.unshift(action.payload)
      state.isLoading = false
    },
    updatePaymentCompleted: (state, action) => {
      const index = state.result.findIndex((x) => x.id === action.payload.id)
      if (index !== -1) state.result[index] = action.payload
      state.isLoading = false
    },
    deletePaymentCompleted: (state, action) => {
      state.result = state.result.filter((x) => x.id !== action.payload)
      state.isLoading = false
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  getAllPayments,
  setAllPayments,
  setPayment,
  getPaymentList,
  setPaymentList,
  createPayment,
  updatePayment,
  deletePayment,
  createPaymentCompleted,
  updatePaymentCompleted,
  deletePaymentCompleted,
  setIsLoading,
} = paymentSlice.actions

export default paymentSlice.reducer
