import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  result: [],
  totalCount: 0,
  selectedGoodReceiveds: {},
  isLoading: false,
}

const goodReceivedSlice = createSlice({
  name: 'goodReceiveds',
  initialState,
  reducers: {
    getAllGoodReceiveds: (state) => {
      state.isLoading = true
    },

    createGoodReceived: (state) => {
      state.isLoading = true
    },
    updateGoodReceived: (state) => {
      state.isLoading = true
    },
    deleteGoodReceived: (state) => {
      state.isLoading = true
    },

    setAllGoodReceiveds: (state, action) => {
      state.result = action.payload.items || []
      state.totalCount = action.payload.totalCount || 0
      state.isLoading = false
    },
    setGoodReceived: (state, action) => {
      state.selectedGoodReceiveds = action.payload
    },
    createGoodReceivedCompleted: (state, action) => {
      state.result.unshift(action.payload)
      state.isLoading = false
    },
    updateGoodReceivedCompleted: (state, action) => {
      const index = state.result.findIndex((x) => x.id === action.payload.id)
      if (index !== -1) state.result[index] = action.payload
      state.isLoading = false
    },
    deleteGoodReceivedCompleted: (state, action) => {
      state.result = state.result.filter((x) => x.id !== action.payload)
      state.isLoading = false
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  getAllGoodReceiveds,
  setAllGoodReceiveds,
  setGoodReceived,
  createGoodReceived,
  updateGoodReceived,
  deleteGoodReceived,
  createGoodReceivedCompleted,
  updateGoodReceivedCompleted,
  deleteGoodReceivedCompleted,
  setIsLoading,
} = goodReceivedSlice.actions

export default goodReceivedSlice.reducer
