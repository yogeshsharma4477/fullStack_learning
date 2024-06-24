import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
}

export const landingSlice = createSlice({
    name: 'landing',
    initialState,
    reducers: {
        increment: (state) => {

        }
    }
})

// Action creators are generated for each case reducer function
export const { increment } = landingSlice.actions

export default landingSlice.reducer