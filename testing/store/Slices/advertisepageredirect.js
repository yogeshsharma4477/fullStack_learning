import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    redirectToAdvertise: false,
}

const AddRedirectAdvertiseSlice = createSlice({
    name: 'AddRedirectAdvertiseSlice',
    initialState,
    reducers: {
        sendToAdvertisePage: (state, action) => {
            console.log('AddRedirectAdvertiseSlice', state, action)
            state.redirectToAdvertise = action.payload
        },
        resetAdvertiseRedirect: (state, action) => {
            state.redirectToAdvertise = false
        },
    },
})

export default AddRedirectAdvertiseSlice.reducer
export const { sendToAdvertisePage, resetAddContact } =
    AddRedirectAdvertiseSlice.actions
