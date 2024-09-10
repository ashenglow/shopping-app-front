import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPage: 0,
  totalPages: 0,
  pageSize: 10,
  totalItems: 0,
};

const paginationSlice = createSlice({
  name: 'pagination',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    setTotalItems: (state, action) => {
      state.totalItems = action.payload;
    },
    updatePagination: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  setCurrentPage,
  setTotalPages,
  setPageSize,
  setTotalItems,
  updatePagination,
} = paginationSlice.actions;

export default paginationSlice.reducer;