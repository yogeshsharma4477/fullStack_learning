import MainCategory from "./MainCategory";
import { useSelector } from "react-redux";
import Suggestedcategories from "./Suggestions";
import { useEffect } from "react";

const NewCategoryFlow = ({ IP }) => {
  
  const isSuggestionOpen = useSelector((state) => state.category);
  
  useEffect(() => {
    document.cookie = "isFlow = false"
  }, [])
  
  return isSuggestionOpen?.isSuggestedOpen ? (
    <Suggestedcategories />
  ) : (
    <MainCategory
      IP={IP}
    />
  );
};

export default NewCategoryFlow;
