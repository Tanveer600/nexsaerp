import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  result: [], // Ismein items ayenge
  totalCount: 0, // Pagination ke liye
  selectedProduct: {},
  dropdownList: [],
  isLoading: false,
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    getAllProducts: (state) => {
      state.isLoading = true
    },
    getProductList: (state) => {
      state.isLoading = true
    },
    setProductList: (state, action) => {
      state.dropdownList = action.payload || []
    },
    createProduct: (state) => {
      state.isLoading = true
    },
    updateProduct: (state) => {
      state.isLoading = true
    },
    deleteProduct: (state) => {
      state.isLoading = true
    },

    setAllProducts: (state, action) => {
      state.result = action.payload.items || []
      state.totalCount = action.payload.totalCount || 0
      state.isLoading = false
    },
    setProduct: (state, action) => {
      state.selectedProduct = action.payload
    },
    createProductCompleted: (state, action) => {
      state.result.unshift(action.payload)
      state.isLoading = false
    },
    updateProductCompleted: (state, action) => {
      const index = state.result.findIndex((x) => x.id === action.payload.id)
      if (index !== -1) state.result[index] = action.payload
      state.isLoading = false
    },
    deleteProductCompleted: (state, action) => {
      state.result = state.result.filter((x) => x.id !== action.payload)
      state.isLoading = false
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  getAllProducts,
  setAllProducts,
  setProduct,
  getProductList,
  setProductList,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductCompleted,
  updateProductCompleted,
  deleteProductCompleted,
  setIsLoading,
} = productSlice.actions

export default productSlice.reducer
