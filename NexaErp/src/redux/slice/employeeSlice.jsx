import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  result: [], // Ismein items ayenge
  totalCount: 0, // Pagination ke liye
  selectedEmployee: { id: 0, name: '' },
  isLoading: false,
}

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    getAllEmployees: (state) => {
      state.isLoading = true
    },
    createEmployee: (state) => {
      state.isLoading = true
    },
    updateEmployee: (state) => {
      state.isLoading = true
    },
    deleteEmployee: (state) => {
      state.isLoading = true
    },

    setAllEmployees: (state, action) => {
      state.result = action.payload.items || []
      state.totalCount = action.payload.totalCount || 0
      state.isLoading = false
    },
    setEmployee: (state, action) => {
      state.selectedEmployee = action.payload
    },
    createEmployeeCompleted: (state, action) => {
      state.result.unshift(action.payload)
      state.isLoading = false
    },
    updateEmployeeCompleted: (state, action) => {
      const index = state.result.findIndex((x) => x.id === action.payload.id)
      if (index !== -1) state.result[index] = action.payload
      state.isLoading = false
    },
    deleteEmployeeCompleted: (state, action) => {
      state.result = state.result.filter((x) => x.id !== action.payload)
      state.isLoading = false
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  getAllEmployees,
  setAllEmployees,
  setEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  createEmployeeCompleted,
  updateEmployeeCompleted,
  deleteEmployeeCompleted,
  setIsLoading,
} = employeeSlice.actions

export default employeeSlice.reducer
