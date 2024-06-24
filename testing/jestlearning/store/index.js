import { configureStore } from '@reduxjs/toolkit'
import landing from './slice/landing'


export const store = configureStore({
    reducer: {
        landing: landing
    },
})