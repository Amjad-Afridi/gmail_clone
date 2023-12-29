import {configureStore} from "@reduxjs/toolkit";
import {UserSliceReducer} from './Slices/UserSlice'
const Store = configureStore({
   reducer: {
       user: UserSliceReducer
   }
})
export {Store}
export * from './Thunks/UserProfile'