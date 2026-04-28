import { createSlice } from '@reduxjs/toolkit'

const sidebarSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarShow: true,
  },
  reducers: {
    setSidebarShow: (state, action) => {
      state.sidebarShow = action.payload
    },
  },
})

export const { setSidebarShow } = sidebarSlice.actions
export default sidebarSlice.reducer