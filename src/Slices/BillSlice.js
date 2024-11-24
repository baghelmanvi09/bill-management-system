// src/Slices/BillSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bills: [],
  customers: [], // Array to store customer data
};

const billSlice = createSlice({
  name: 'bill',
  initialState,
  reducers: {
    saveBill: (state, action) => {
      const { clientName, mobileNumber, address,year, status, billingDate, expireDate, note, items } = action.payload;

      // Calculate the total price for the bill
      const totalPrice = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
      const customer = {
        customerName: clientName,
        mobileNumber: mobileNumber, // You can add this field in the form if needed
        address: address, // You can add this field in the form if needed
        billingPrice: totalPrice,
        billingDate,
      };

      // Save the bill data
      state.bills.push(action.payload);

      // Add the customer to the customers list
      state.customers.push(customer);
    },
  },
});

export const { saveBill } = billSlice.actions;
export default billSlice.reducer;
