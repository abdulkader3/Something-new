import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'User',
  initialState: {

    userdata: JSON.parse(localStorage.getItem('ClintInfo')) ? JSON.parse(localStorage.getItem('ClintInfo')) : null,

  },

  reducers: {
   
    userData: (state, action) => {
      state.value = action.payload
    },
  },
  
})

export const { userData } = userSlice.actions

export default userSlice.reducer