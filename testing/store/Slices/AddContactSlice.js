// extraReducers = indicates are additional reducers apart from the reducers generated by create slice
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  contactPerson: "",
  Designation: "",
  mobile_number: [],
  landline_number: [],
  EmailId: [],
  WhatsappNos: []
};

const AddContactSlice = createSlice({
  name: "AddContact",
  initialState,
  reducers: {
    updatecontactPerson: (state, action) => {
      state.contactPerson = action.payload;
    },
    updateDesignation: (state, action) => {
      state.Designation = action.payload;
    },
    updateMobileNumber: (state, action) => {
      state.mobile_number = action.payload;
    },
    updateLandlineNumber: (state, action) => {
      state.landline_number = action.payload;
    },
    updateEmailId: (state, action) => {
      state.EmailId = action.payload;
    },
    updateWhatsAppNumber: (state, action) => {
      state.WhatsappNos = action.payload;
    },
    resetAddContact: (state, action) => {
      state.contactPerson = "";
      state.Designation = "";
      state.mobile_number = [];
      state.landline_number = [];
      state.EmailId = [];
      state.WhatsappNos = []
    },
  },
});

export default AddContactSlice.reducer;
export const {
  updatecontactPerson,
  updateDesignation,
  updateMobileNumber,
  updateLandlineNumber,
  updateEmailId,
  updateWhatsAppNumber,
  resetAddContact
} = AddContactSlice.actions;

// currentComponent/updateForm = Actions type
