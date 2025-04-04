import { configureStore } from '@reduxjs/toolkit'
import Userdata from '../src/Slice/SliceUser'
import clintdata from '../src/Slice/SliceClint'

export default configureStore({
  reducer: {
    info: Userdata,
    infoclint: clintdata,
  },
})