export default function Input({ label, value, list, name, onChange, handleSelectList, isFocus, handleClearBtn, handleFocusAndBlur, isDisable, showCancelbtn }) {
  return (
    <div className={`inputwrap mb-20`}>
      <input type="text" value={value} onFocus={(e) => handleFocusAndBlur(e, name, "focus")} onBlur={(e) => handleFocusAndBlur(e, name, "blur")} onChange={onChange} className={`input`} required disabled={isDisable} />
      <label className={`input__label`}>{label}</label>
      {
        !showCancelbtn ? <button className={`button iconwrap closeicon__grey`} onClick={(e) => handleClearBtn(e, name)}></button>
          : <></>
      }
      <ul className={`dropdown customscroll ${list?.length && isFocus ? "" : "dn"}`}>
        {
          isFocus && Array.isArray(list) && list.map(value => {
            return (
              <li onClick={(e) => handleSelectList(e, name, value)}>{value}</li>
            )
          })
        }
      </ul>
    </div>
  )
}