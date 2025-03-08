import { useState } from "react";

export function useInput(initialValue, validationFn) {
  const [value, setValue] = useState(initialValue);
  const [didEdit, setDidEdit] = useState(false);

  const valueIsValid = validationFn(value);

  const handleInputChange = (event) => {
    setValue(event.target.value);
    setDidEdit(false);
  };

  function handleInputBlur() {
    setDidEdit(true);
  }

  return {
    value,
    handleInputChange,
    handleInputBlur,
    hasError: didEdit && !valueIsValid,
  };
}