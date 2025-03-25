import { createSlice } from '@reduxjs/toolkit'

export const clintSlice = createSlice({
  name: 'Clint',
  initialState: {

    value: JSON.parse(localStorage.getItem('clintDataStore')) ? JSON.parse(localStorage.getItem('clintDataStore')) : null,

  },

  reducers: {
   
    clintData: (state, action) => {
      state.value = action.payload
    },
  },
  
})

export const { clintData } = clintSlice.actions

export default clintSlice.reducer