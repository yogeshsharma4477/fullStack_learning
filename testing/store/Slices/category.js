import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { mainCategoryApi, fetchSuggestedCategory } from "./apis/categoryApi";
import { useDispatch, useSelector } from "react-redux";

// const dispatch = useDispatch();

const initialState = {
  dropdownData: [],
  suggestedCategory: {},
  allsuggestedcategories: {},
  isLoading: false,
  currentSelectedCategory: {},
  error: {
    isError: false,
    errorMessage: "",
  },
  isSuggestedOpen: false,
  selectedCategory: {},
  errorPopup: {
    show: false,
    message: "",
  },
};

export const getDropDownFromCache = (state, keyword) =>
  state.dropDownData.filter((elements) => elements.v.includes(keyword));

export const getSuggestedDataFromCache = (state, id) => {
  state.suggestedCategory[id].filter(
    (subcategories) =>
      subcategories.national_catid !==
      state.selectedCategory[subcategories.national_catidk]
  );
};

export const fetchMainCategories = createAsyncThunk(
  "category/fetchMainCategories",
  async ({ keyword }) => {
    console.log(keyword);
    try {
      if (keyword.length < 3) {
        return [];
      }
      const response = await mainCategoryApi(keyword);
      if (response.errors.code !== 0) {
        throw new Error(response.errors.msg);
      }
      if (response.results.length <= 0) {
        throw new Error("Cannot find Category");
      }
      return response.results.data;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
);

export const fetchSuggestionForMainSelection = createAsyncThunk(
  "category/fetchSuggestionForMainSelection",
  async (currentMainCategory, { getState, dispatch }) => {
    const { category } = getState();
    try {
      const currentSelectedMCN = currentMainCategory?.mcn || null;
      const currentSelectedCatID = currentMainCategory?.ncid || null;
      const currentSelectedCity = currentMainCategory?.city || "";

      let preFetchedSuggestedCategory = category?.allsuggestedcategories[currentSelectedCatID] || [];
      let selectedCategoryObj = category?.selectedCategory || {};
      
      if (!!preFetchedSuggestedCategory?.length) {
        let returnSuggestCategoryArr = []
        returnSuggestCategoryArr = [] 

        preFetchedSuggestedCategory.map((categoryData, index)=>{
          let key = categoryData?.national_catid || categoryData?.ncid || null;

          if(key && !selectedCategoryObj.hasOwnProperty(key)){
            returnSuggestCategoryArr.push(categoryData);
          }
        }) 

        dispatch(setSuggestionScreen({ flag: true }));
        return returnSuggestCategoryArr;

      } else {
        if(!(currentSelectedMCN && currentSelectedCatID)) {
          throw new Error("Connection Timeout");
        }

        const categories = await fetchSuggestedCategory(
          currentSelectedMCN,
          currentSelectedCity,
          currentSelectedCatID
        );
        
        let suggestedCategoryArr = categories?.results || [];

        dispatch(
          setAllSuggestedCategories({
            [currentSelectedCatID]: suggestedCategoryArr,
          })
        );

        if (suggestedCategoryArr.length <= 1) {
          dispatch(setSuggestionScreen({ flag: false }));
          dispatch(addRemoveSelectedCategory(currentMainCategory));
          return [];
        } else {
          dispatch(setSuggestionScreen({ flag: true }));
        }

        return suggestedCategoryArr;
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        throw new Error("Connection Timeout");
      }
      throw new Error(error);
    }
  }
);

const categorySlices = createSlice({
  name: "category",
  initialState,
  reducers: {
    setAllSuggestedCategories: (state, action) => {
      state.allsuggestedcategories = {
        ...state.allsuggestedcategories,
        ...action.payload,
      };
    },
    setCurrentSuggestion: (state, action) => {
      state.suggestedCategory = {
        ...action.payload,
      };
    },
    addRemoveSelectedCategory: (state, action) => {
      if (
        !state.selectedCategory[
          action.payload.national_catid || action.payload.ncid
        ]
      ) {
        state.selectedCategory = {
          ...state.selectedCategory,
          [action.payload.national_catid || action.payload.ncid]: {
            ...action.payload,
          },
        };
      } else {
        const stJson = JSON.stringify(state.selectedCategory);
        const jsSon = JSON.parse(stJson);
        delete jsSon[action.payload.national_catid || action.payload.ncid];
        state.selectedCategory = { ...jsSon };
      }
    },
    setSuggestionScreen: (state, action) => {
      state.isSuggestedOpen = action.payload.flag;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload.flag;
    },
    removeParentSelection: (state, action) => {
      const stJson = JSON.stringify(state.selectedCategory);
      const jsSon = JSON.parse(stJson);
      delete jsSon[action.payload.ncid];
      state.selectedCategory = { ...jsSon };
    },
    closeErrorPop: (state, action) => {
      state.errorPopup = {
        show: false,
        message: "",
      };
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchMainCategories.pending, (state, action) => {
      // state.isLoading = true;
    });
    builder.addCase(fetchMainCategories.fulfilled, (state, action) => {
      // state.isLoading = false;
      state.dropdownData = [...action.payload];
      state.error = {
        isError: false,
        errorMessage: "",
      };
    });
    builder.addCase(fetchMainCategories.rejected, (state, action) => {
      // state.isLoading = false;
      state.error = {
        isError: true,
        errorMessage: action.error,
      };
    });
    builder.addCase(
      fetchSuggestionForMainSelection.pending,
      (state, action) => {
        console.log(action);
        state.isLoading = true;
        state.currentSelectedCategory = action.meta.arg;
        state.currentSelectedCategory = {
          ...state.currentSelectedCategory,
          [action.meta.arg.ncid]: action.meta.arg,
        };
      }
    );
    builder.addCase(
      fetchSuggestionForMainSelection.fulfilled,
      (state, action) => {
        state.isLoading = false;
        state.suggestedCategory = action.payload.slice(1, 17);
      }
    );
    builder.addCase(
      fetchSuggestionForMainSelection.rejected,
      (state, action) => {
        state.isLoading = false;
        state.errorPopup = {
          show: true,
          message: action.error.message,
        };
      }
    );
  },
});

export const {
  setAllSuggestedCategories,
  setCurrentSuggestion,
  addRemoveSelectedCategory,
  setSuggestionScreen,
  closeErrorPop,
} = categorySlices.actions;
export default categorySlices.reducer;
