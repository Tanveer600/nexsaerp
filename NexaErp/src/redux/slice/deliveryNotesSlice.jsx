import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  result: [],
  totalCount: 0,
  selectedDeliveryNotes: {},
  isLoading: false,
}

const deliveryNotesSlice = createSlice({
  name: 'DeliveryNotes',
  initialState,
  reducers: {
    getAllDeliveryNotes: (state) => {
      state.isLoading = true
    },

    createDeliveryNote: (state) => {
      state.isLoading = true
    },
    updateDeliveryNote: (state) => {
      state.isLoading = true
    },
    deleteDeliveryNote: (state) => {
      state.isLoading = true
    },

    setAllDeliveryNotes: (state, action) => {
      state.result = action.payload.items || []
      state.totalCount = action.payload.totalCount || 0
      state.isLoading = false
    },
    setDeliveryNote: (state, action) => {
      state.selectedDeliveryNotes = action.payload
    },
    createDeliveryNoteCompleted: (state, action) => {
      state.result.unshift(action.payload)
      state.isLoading = false
    },
    updateDeliveryNoteCompleted: (state, action) => {
      const index = state.result.findIndex((x) => x.id === action.payload.id)
      if (index !== -1) state.result[index] = action.payload
      state.isLoading = false
    },
    deleteDeliveryNoteCompleted: (state, action) => {
      state.result = state.result.filter((x) => x.id !== action.payload)
      state.isLoading = false
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  getAllDeliveryNotes,
  setAllDeliveryNotes,
  setDeliveryNote,
  createDeliveryNote,
  updateDeliveryNote,
  deleteDeliveryNote,
  createDeliveryNoteCompleted,
  updateDeliveryNoteCompleted,
  deleteDeliveryNoteCompleted,
  setIsLoading,
} = deliveryNotesSlice.actions

export default deliveryNotesSlice.reducer
