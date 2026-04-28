import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  result: [],
  selectedTenant: { id: 0, name: '' },
  isLoading: false,
}

const branchSlice = createSlice({
  name: 'branches',
  initialState,
  reducers: {
    getAllBranches: (state) => {
      state.isLoading = true
    },
    createBranch: (state) => {
      state.isLoading = true
    },
    updateBranch: (state) => {
      state.isLoading = true
    },
    deleteBranch: (state) => {
      state.isLoading = true
    },

    // State update actions (called by Saga)
    setAllBranches: (state, action) => {
      state.result = action.payload || []
      state.isLoading = false
    },
    setBranch: (state, action) => {
      state.selectedBranch = action.payload
    },
    createBranchCompleted: (state, action) => {
      state.result.unshift(action.payload)
      state.isLoading = false
    },
    updateBranchCompleted: (state, action) => {
      const index = state.result.findIndex((x) => x.id === action.payload.id)
      if (index !== -1) state.result[index] = action.payload
      state.isLoading = false
    },
    deleteBranchCompleted: (state, action) => {
      state.result = state.result.filter((x) => x.id !== action.payload)
      state.isLoading = false
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  getAllBranches,
  setAllBranches,
  setBranch,
  createBranch,
  updateBranch,
  deleteBranch,
  createBranchCompleted,
  updateBranchCompleted,
  deleteBranchCompleted,
  setIsLoading,
} = branchSlice.actions

export default branchSlice.reducer
