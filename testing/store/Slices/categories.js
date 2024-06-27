import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mainCategory: "",
  suggestedCategory: [],
  allSubCatsList: [],
  hashCats: {},
};

const categorySlice = createSlice({
  name: "addCategories",
  initialState,
  reducers: {
    updateMainCategory: (state, action) => {
      state.mainCategory = {
        ...state.mainCategory,
        [action.payload.ncid]: action.payload,
      };
    },
    removeMainCategory: (state, action) => {
      let newMainCat = {};
      Object.keys(state.mainCategory)
        .filter((ncids) => ncids !== action.payload.ncid)
        .forEach((ncid) => ({
          ...newMainCat,
          [ncid]: state.mainCategory[ncid],
        }));
      state.mainCategory = newMainCat;
      // state.hashCats = Object.keys(state.hashCats).filter(
      //   (catids) =>
      //     state.hashCats[catids].associate_national_catid !==
      //     action.payload.ncid
      // );
    },
    updateSuggestedCategory: (state, action) => {
      if (state.hashCats[action.payload.national_catid]) {
        state.suggestedCategory = state.suggestedCategory.filter(
          (categories) =>
            categories.national_catid !== action.payload.national_catid
        );
        state.hashCats = {
          ...state.hashCats,
          [action.payload.national_catid]: false,
        };
      } else {
        state.suggestedCategory = [
          ...state.suggestedCategory,
          { ...action.payload, selected: true },
        ];
        state.hashCats = {
          ...state.hashCats,
          [action.payload.national_catid]: {
            ...action.payload,
            selected: true,
          },
        };
      }
    },
    addSuggestedCategories: (state, action) => {
      let hashMap = {};
      state.suggestedCategory = [...action.payload];
      // state.hashCats = action.payload.map(({ national_catid }) => ({
      //   [national_catid]: true,
      // }));
      for (let i = 0; i < action.payload.length; i = i + 1) {
        if (action.payload[i].selected) {
          hashMap = {
            ...hashMap,
            [action.payload[i].national_catid]: action.payload[i],
          };
        }
      }
      console.log(hashMap);
      state.hashCats = hashMap;
    },
    setSuggestedSubCatsList: (state, action) => {
      state.allSubCatsList = [...action.payload];
    },
    updateHashTable: (state, action) => {
      state.hashCats = {
        ...state.hashCats,
        [`${action.payload.national_catid}/${action.payload.associate_national_catid}`]:
          {
            ...(state.hashCats[
              `${action.payload.national_catid}/${action.payload.associate_national_catid}`
            ]
              ? state.hashCats[
                  `${action.payload.national_catid}/${action.payload.associate_national_catid}`
                ]
              : action.payload),
            selected: state.hashCats[
              `${action.payload.national_catid}/${action.payload.associate_national_catid}`
            ]?.selected
              ? false
              : true,
          },
      };
    },
  },
});

export default categorySlice.reducer;

export const {
  updateMainCategory,
  updateSuggestedCategory,
  addSuggestedCategories,
  setSuggestedSubCatsList,
  updateHashTable,
  removeMainCategory,
} = categorySlice.actions;
