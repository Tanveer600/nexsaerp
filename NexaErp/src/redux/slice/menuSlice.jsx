import { createSlice } from '@reduxjs/toolkit'
const initialState = {
  result: [],
  selectedMenu: { id: 0, name: '' },
  isLoading: false,
}

const menuSlice = createSlice({
  name: 'menus',
  initialState,
  reducers: {
    getAllMenus: (state) => {
      state.isLoading = true
    },
    createMenu: (state) => {
      state.isLoading = true
    },
    updateMenu: (state) => {
      state.isLoading = true
    },
    deleteMenu: (state) => {
      state.isLoading = true
    },
    getMenuByRole: (state) => {
      state.isLoading = true
    },
    setAllMenus: (state, action) => {
      state.result = action.payload || []
      state.isLoading = false
    },
    setMenu: (state, action) => {
      state.selectedMenu = action.payload
    },
    createMenuCompleted: (state, action) => {
      state.result.unshift(action.payload)
      state.isLoading = false
    },
    updateMenuCompleted: (state, action) => {
      const index = state.result.findIndex((x) => x.id === action.payload.id)
      if (index !== -1) state.result[index] = action.payload
      state.isLoading = false
    },
    deleteMenuCompleted: (state, action) => {
      state.result = state.result.filter((x) => x.id !== action.payload)
      state.isLoading = false
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  getAllMenus,
  setAllMenus,
  setMenu,
  createMenu,
  updateMenu,
  deleteMenu,
  createMenuCompleted,
  updateMenuCompleted,
  deleteMenuCompleted,
  setIsLoading,
  getMenuByRole,
} = menuSlice.actions

export default menuSlice.reducer
