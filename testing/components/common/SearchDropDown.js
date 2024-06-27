import { useState, forwardRef, useRef, useEffect } from "react";
import styles from "./searchdropdown.module.scss";
import useClickOutside from "@/hooks/useClickOutSide";

const SearchDropDown = ({}) => {
  const [keyword, setKeyword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [drList, setDrList] = useState(true);
  const drRef = useRef(null);
  const changeSlideState = () => {
    setIsOpen(!isOpen);
  };
  useClickOutside(ref, () => changeSlideState);

  useEffect(() => {}, [keyword]);

  return (
    <div
      className={`inputwrap  ${
        listCategories.length < 1 && error.isError === 1 && keyword !== ""
          ? "inputwrap__error"
          : ""
      } mb-20`}
    >
      <span className={`iconwrap ${styles.searchicon}`} />
      <span
        onClick={() => {
          setKeyword("");
        }}
        className={`iconwrap closeicon__grey`}
      />
      <input
        ref={inputRef}
        className={`input ${styles.textsearch}`}
        type="text"
        placeholder="Add Business Category"
        onClick={() => {
          setKeyword("");
        }}
        onChange={(e) => {
          setKeyword(e.target.value);
        }}
        onFocus={() => {
          //make api call if keyword is not empty
        }}
        required
      />
      <ul
        ref={drRef}
        className={`dropdown color111 ${
          keyword === "" || listCategories.length < 1 ? "dn" : ""
        }`}
      >
        {listCategories.map((categories) => {
          return !catHash[categories.national_catid] ? (
            <li
              key={categories.ncid}
              onClick={() => {
                setListCategories([]);
                setKeyword("");
                setSelectedCategory((currentCategories) => {
                  return [
                    ...currentCategories,
                    { ...categories, selected: true },
                  ];
                });
              }}
              dangerouslySetInnerHTML={{
                __html: categories.category_name,
              }}
            ></li>
          ) : null;
        })}
      </ul>
      {keyword !== "" && listCategories.length < 1 ? (
        <div className="error__message mt-5">Cannot Find Category</div>
      ) : null}
    </div>
  );
};
