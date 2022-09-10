import React from "react";
import debounce from "lodash.debounce";

const Search = ({ setSearchValue }) => {
  const [value, setValue] = React.useState("");

  const updateSearchValue = React.useCallback(
    debounce((string) => {
      setSearchValue(string);
    }, 700),
    []
  );

  const onChangeHandle = (evt) => {
    const string = evt.target.value;
    updateSearchValue(string);
    setValue(string);
  };

  return <input value={value} onChange={onChangeHandle} />;
};

export default Search;
