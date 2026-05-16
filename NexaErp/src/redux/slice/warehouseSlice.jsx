import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  result: [], // Ismein items ayenge
  totalCount: 0, // Pagination ke liye
  selectedWarehouses: {},
  dropdownList: [],
  isLoading: false,
}

const warehouseSlice = createSlice({
  name: 'warehouses',
  initialState,
  reducers: {
    getAllWarehouses: (state) => {
      state.isLoading = true
    },
    getWarehouseList: (state) => {
      state.isLoading = true
    },
    setWarehouseList: (state, action) => {
      state.dropdownList = action.payload || []
    },
    createWarehouse: (state) => {
      state.isLoading = true
    },
    updateWarehouse: (state) => {
      state.isLoading = true
    },
    deleteWarehouse: (state) => {
      state.isLoading = true
    },

    setAllWarehouses: (state, action) => {
      state.result = action.payload.items || []
      state.totalCount = action.payload.totalCount || 0
      state.isLoading = false
    },
    setWarehouse: (state, action) => {
      state.selectedWarehouses = action.payload
    },
    createWarehouseCompleted: (state, action) => {
      state.result.unshift(action.payload)
      state.isLoading = false
    },
    updateWarehouseCompleted: (state, action) => {
      const index = state.result.findIndex((x) => x.id === action.payload.id)
      if (index !== -1) state.result[index] = action.payload
      state.isLoading = false
    },
    deleteWarehouseCompleted: (state, action) => {
      state.result = state.result.filter((x) => x.id !== action.payload)
      state.isLoading = false
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  getAllWarehouses,
  setAllWarehouses,
  setWarehouse,
  setWarehouseList,
  getWarehouseList,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  createWarehouseCompleted,
  updateWarehouseCompleted,
  deleteWarehouseCompleted,
  setIsLoading,
} = warehouseSlice.actions

export default warehouseSlice.reducer
