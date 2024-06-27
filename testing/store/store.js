import { configureStore } from '@reduxjs/toolkit'
import CurrentComponentSlice from './Slices/CurrentCompoentSlice'
import AddContactSlice from './Slices/AddContactSlice'
import AddressSlice from './Slices/AddressSlice'
import updateCommonValues from './Slices/commonDataSlice'
import updateBussinessList from './Slices/bussinessSlice'
import updateTimmingArr from './Slices/addTiimmingSlice'
import categories from './Slices/categories'
import imageSlice from './Slices/imageSlice'
import category from './Slices/category'
import AddPhotoSlice from './Slices/AddPhotoSlice'
import AddRedirectAdvertiseSlice from './Slices/advertisepageredirect'
import landinfPageSlice from './Slices/landingPageSlice'
import newCategoryPageSlice from './Slices/newCategorySlice'
import dcLandingSlice from './Slices/dc/landing'

//configure accept an argument as an object
//thisis were we specify all the reducer from slice that belong
const store = configureStore({
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
    reducer: {
        CurrentPage: CurrentComponentSlice,
        AddContact: AddContactSlice,
        Address: AddressSlice,
        CommonValues: updateCommonValues,
        images: imageSlice,
        BusinessList: updateBussinessList,
        TimmingList: updateTimmingArr,
        categories: categories,
        category: category,
        AddPhotoData: AddPhotoSlice,
        landinfPageSlice: landinfPageSlice,
        redirectAdvertise: AddRedirectAdvertiseSlice,
        newCategoryPageSlice: newCategoryPageSlice,
        dcLandingSlice: dcLandingSlice
    },
    // middleware : (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
})

export default store
