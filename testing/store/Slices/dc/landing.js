import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    title: "",
    contactPerson: "",
    mobile_number: [],
    landline_number: [],
    stdcode:'',
    city: "",
    area: "",
    state: "",
    pincode: "",
    businessName: ""
};

const dcLandingSlice = createSlice({
    name: "dcLandingSlice",
    initialState,
    reducers: {
        updatecontactPerson: (state, action) => {
            state.contactPerson = action.payload;
        },
        updateMobileNumber: (state, action) => {
            state.mobile_number = action.payload;
        },
        updateLandlineNumber: (state, action) => {
            state.landline_number = action.payload;
        },
        updateLandingSlice: (state, action) => {
            state[action.payload.name] = action.payload.value
        },
        updateMultipleState: (state, action) => {
            return state = { ...state, ...action.payload }
        },
        resetAddContact: (state, action) => {
            state.contactPerson = "";
            state.mobile_number = [];
            state.landline_number = [];
        },
    },
});

export default dcLandingSlice.reducer;
export const {
    updateLandingSlice,
    updatecontactPerson,
    updateMultipleState,
    updateMobileNumber,
    updateLandlineNumber,
    resetAddContact
} = dcLandingSlice.actions;

// currentComponent/updateForm = Actions type
