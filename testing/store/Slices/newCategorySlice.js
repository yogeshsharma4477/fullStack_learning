// extraReducers = indicates are additional reducers apart from the reducers generated by create slice
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    historyState: [],
    currCategoryData: {},
    suggestedCategoryData: {}
};

const newCategoryPageSlice = createSlice({
  name: "newCategorySlice",
  initialState,
  reducers: {
    updateCategoryValues: (state, action) => {
      state[action.payload.key] = action.payload.value;
    },
    updateMultipleCategoryValues: (state, action) => {
      state = { ...state,    ...action.payload };
      return state;
    },
    updateCategoryHistoryValues: (state, action) => {
        state = { 
            ...state, 
            historyState: [...state.historyState, ...[action.payload]]
        };
      return state;
    },
    updateCurrCategoryValues: (state, action) => {
      state = { 
          ...state, 
          currCategoryData: {...action.payload}
      };
      return state;
    },
    updateSuggestedCategoryValues: (state, action) => {
      state = { 
          ...state, 
          suggestedCategoryData: {...action.payload}
      };
      return state;
    },
    removeCategoryHistoryValues: (state, action) => {
      let tempState = {...state};
      if(state.historyState?.length>0){
        tempState.historyState.shift();
      }
      return tempState;
    },
    resetCategory: (state, action) => {
      state = {
        historyState: [],
        currCategoryData: {},
        suggestedCategoryData: {}
      };
      return state;
    }

  },
});

export default newCategoryPageSlice.reducer;
export const { updateCategoryValues, updateMultipleCategoryValues, updateCategoryHistoryValues,resetCategory,
   removeCategoryHistoryValues, updateCurrCategoryValues, updateSuggestedCategoryValues } =
newCategoryPageSlice.actions;
