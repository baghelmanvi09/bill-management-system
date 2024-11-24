// src/store.js

import { configureStore } from '@reduxjs/toolkit';
import billReducer from './Slices/BillSlice';  // Ensure this is correct

const store = configureStore({
  reducer: {
    bill: billReducer,
  },
});

export default store;
