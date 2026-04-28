



import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
const userSlice = createSlice({
  name: 'users',
  initialState: {
    isLoading: false,
    users: [],
    statuses: [],
  },
  reducers: {
    getUsers(state) {
      state.isLoading = true;
    },
    setUsers(state, action) {
      state.isLoading = false;
      state.users = action.payload;
    },
    getStatuses(state) {
      state.isLoading = true;
    },
    setStatuses(state, action) {
      state.isLoading = false;
      state.statuses = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const { getUsers, setUsers, getStatuses, setStatuses, setIsLoading } =
  userSlice.actions;

export default userSlice.reducer;

// Selectors
export const getAvailableUsers = createSelector(
  (state) => state.users.users,
  (users) => users
);

export const getAvailableStatuses = createSelector(
  (state) => state.users.statuses,
  (statuses) => statuses
);

export const getIsLoading = createSelector(
  (state) => state.users.isLoading,
  (isLoading) => isLoading
);