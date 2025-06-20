import React, { createContext, useReducer } from 'react';
import AppReducer from './AppReducer';
import axios from 'axios';

// Actions
export const GET_TRANSACTIONS = 'GET_TRANSACTIONS';
export const ADD_TRANSACTION = 'ADD_TRANSACTION';
export const DELETE_TRANSACTION = 'DELETE_TRANSACTION';
export const UPDATE_TRANSACTION = 'UPDATE_TRANSACTION';
export const CLEAR_TRANSACTIONS = 'CLEAR_TRANSACTIONS';
export const SET_CURRENT = 'SET_CURRENT';
export const CLEAR_CURRENT = 'CLEAR_CURRENT';
export const TRANSACTION_ERROR = 'TRANSACTION_ERROR';

// Initial State
const initialState = {
  transactions: [],
  error: null,
  loading: true,
};

// Create Context
export const GlobalContext = createContext(initialState);

// Provider Component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // Actions
  async function getTransactions() {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/transactions`);
      dispatch({
        type: GET_TRANSACTIONS,
        payload: res.data.data,
      });
    } catch (err) {
      dispatch({
        type: TRANSACTION_ERROR,
        payload: err?.response?.data?.error || 'Server error',
      });
    }
  }

  async function deleteTransaction(id) {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/transactions/${id}`);
      dispatch({
        type: DELETE_TRANSACTION,
        payload: id,
      });
    } catch (err) {
      dispatch({
        type: TRANSACTION_ERROR,
        payload: err?.response?.data?.error || 'Server error',
      });
    }
  }

  async function addTransaction(transaction) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/transactions`, transaction, config);
      dispatch({
        type: ADD_TRANSACTION,
        payload: res.data.data,
      });
    } catch (err) {
      dispatch({
        type: TRANSACTION_ERROR,
        payload: err?.response?.data?.error || 'Server error',
      });
    }
  }

  return (
    <GlobalContext.Provider
      value={{
        transactions: state.transactions,
        error: state.error,
        loading: state.loading,
        getTransactions,
        deleteTransaction,
        addTransaction,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
