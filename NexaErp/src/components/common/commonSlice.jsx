/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'



const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setActiveScreen(state, action) {
      state.activeScreen = action.payload
    },
  },
})

export const { setActiveScreen } = commonSlice.actions

export default commonSlice.reducer

// Selector
export const getActiveScreen = createSelector(
  (state) => state.common.activeScreen,
  (activeScreen) => activeScreen
)