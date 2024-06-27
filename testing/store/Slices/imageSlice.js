import { createSlice } from "@reduxjs/toolkit";

// const uploadImages = createAsyncThunk("images/uploadImages", async);

const initialState = {
  images: [],
};

const imageSlice = createSlice({
  name: "imageSlice",
  initialState,
  reducers: {
    addPhotos: (state, action) => {
      console.log(action.payload);
      state.images = [...state.images, ...action.payload.images];
    },
    removePhoto: (state, action) => {
      //   const temp = [];
      console.log(action.payload.id);
      state.images = [
        ...state.images.filter((image) => image.id !== action.payload.id),
      ];
      //   for (let i = 0; i < state.images.length; i += 1) {
      //     if (state.images[i].id !== action.payload.id) {
      //       temp.push(state.images[i]);
      //     }
      //   }
      //   state.images = temp;
    },
    addImageUrl: (state, action) => {
      state.images = action.payload.image_urls.map((image) => ({
        id: image[0].split("-").at(-1).split(".")[0],
        data: image[0],
        upload: true,
      }));
    },
    resetImages: (state, action) => {
      state.images = []
    }
  },
});

export default imageSlice.reducer;

export const { addPhotos, removePhoto, addImageUrl, resetAddTiming, resetImages } = imageSlice.actions;
