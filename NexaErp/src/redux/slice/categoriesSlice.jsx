import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  result: [], // Ismein items ayenge
  totalCount: 0, // Pagination ke liye
  selectedCategories: {},
  dropdownList: [],
  isLoading: false,
}

const categoriesSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    getAllCategories: (state) => {
      state.isLoading = true
    },
    getCategorieList: (state) => {
      state.isLoading = true
    },
    setCategorieList: (state, action) => {
      state.dropdownList = action.payload || []
    },
    createCategorie: (state) => {
      state.isLoading = true
    },
    updateCategorie: (state) => {
      state.isLoading = true
    },
    deleteCategorie: (state) => {
      state.isLoading = true
    },

    setAllCategories: (state, action) => {
      state.result = action.payload.items || []
      state.totalCount = action.payload.totalCount || 0
      state.isLoading = false
    },
    setCategorie: (state, action) => {
      state.selectedCategories = action.payload
    },
    createCategorieCompleted: (state, action) => {
      state.result.unshift(action.payload)
      state.isLoading = false
    },
    updateCategorieCompleted: (state, action) => {
      const index = state.result.findIndex((x) => x.id === action.payload.id)
      if (index !== -1) state.result[index] = action.payload
      state.isLoading = false
    },
    deleteCategorieCompleted: (state, action) => {
      state.result = state.result.filter((x) => x.id !== action.payload)
      state.isLoading = false
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  getAllCategories,
  setAllCategories,
  setCategorie,
  getCategorieList,
  setCategorieList,
  createCategorie,
  updateCategorie,
  deleteCategorie,
  createCategorieCompleted,
  updateCategorieCompleted,
  deleteCategorieCompleted,
  setIsLoading,
} = categoriesSlice.actions

export default categoriesSlice.reducer
