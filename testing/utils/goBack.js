// import { setReloadState as setCurrentComponent } from "@/store/Slices/CurrentCompoentSlice";
// import { setReloadState as setCategory } from "@/store/Slices/category";
// import { setReloadState as setImages } from "@/store/Slices/imageSlice";
// import { setReloadState as commonData } from "@/store/Slices/commonDataSlice";
// import { setReloadState as setTiming } from "@/store/Slices/addTiimmingSlice";
// import { setReloadState as setAddress } from "@/store/Slices/AddressSlice";
// import { setReloadState as setBusiness } from "@/store/Slices/bussinessSlice";
// import { setReloadState as setContact } from "@/store/Slices/AddContactSlice";
import { useDispatch } from "react-redux";

import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const useGoBack = () => {
  //   const router = useRouter();
  //   const dispatch = useDispatch();
  //   const state = useSelector((state) => state);
  return router.back();
  //   const setRedux = () => {
  //     dispatch(setCurrentComponent(state.CurrentPage));
  //     dispatch(setCategory(state.category));
  //     dispatch(setBusiness(state.BusinessList));
  //     dispatch(setTiming(state.TimmingList));
  //     dispatch(setContact(state.AddContact));
  //     dispatch(commonData(state.CommonValues));
  //     dispatch(setAddress(state.Address));
  //     dispatch(setImages(state.images));
  //   };
  //   useEffect(() => {
  //     router.events.on("routeChangeStart", () => {
  //       localStorage.setItem("reduxD", state);
  //     });
  //     router.events.on("routeChangeComplete", () => {
  //       setRedux();
  //     });
  //   });
};

export default useGoBack;
