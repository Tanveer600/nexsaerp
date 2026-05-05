import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  emails: [], // Inbox list ke liye
  isLoading: false,
  error: null,
}

const emailSlice = createSlice({
  name: 'emails',
  initialState,
  reducers: {
    fetchInbox: (state) => {
      state.isLoading = true
      state.error = null
    },
    sendEmail: (state) => {
      state.isLoading = true
    },
    syncInbox: (state) => {
      state.isLoading = true
    },

    // State Update Actions (Called by Saga)
    setInbox: (state, action) => {
      state.emails = action.payload || []
      state.isLoading = false
    },
    sendEmailCompleted: (state) => {
      state.isLoading = false
      // Note: Send ke baad agar aapko list refresh karni ho toh saga mein fetchInbox call karein
    },
    syncInboxCompleted: (state) => {
      state.isLoading = false
    },

    // Error handling aur loading states
    setEmailError: (state, action) => {
      state.error = action.payload
      state.isLoading = false
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

// Actions export
export const {
  fetchInbox,
  sendEmail,
  syncInbox,
  setInbox,
  sendEmailCompleted,
  syncInboxCompleted,
  setEmailError,
  setIsLoading,
} = emailSlice.actions

export default emailSlice.reducer
