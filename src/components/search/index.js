import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import { startSearch, setSearchResults, componentHide } from "host/configSlice";
const AutoCompleteSearch = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const isSearching = useSelector(
    (state) => state.config.searchRoute.isSearching
  );
  const searchResults = useSelector(
    (state) => state.config.searchRoute.results
  );
  useEffect(() => {
    const storedSearches =
      JSON.parse(localStorage.getItem("searchHistory")) || [];
    setOptions(storedSearches);
  }, []);
  const saveSearchToLocalStorage = (value) => {
    if (!value.trim()) return;
    const updatedSearches = Array.from(new Set([value, ...options])).slice(
      0,
      10
    );
    localStorage.setItem("searchHistory", JSON.stringify(updatedSearches));
    setOptions(updatedSearches);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && inputValue.trim()) {
      saveSearchToLocalStorage(inputValue);
      dispatch(startSearch(true));
      dispatch(setSearchResults(inputValue));
      dispatch(componentHide(true));
      event.preventDefault();
    }
  };
  const handleInputChange = (event, newInputValue, reason) => {
    setInputValue(newInputValue);
    if (reason === "clear") {
      dispatch(componentHide(false));
    }
  };
  return (
    <Box sx={{ width: "100%", maxWidth: 300, mx: "auto" }}>
      <Autocomplete
        freeSolo
        options={options}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onKeyDown={handleKeyDown}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search..."
            variant="outlined"
            fullWidth
            InputLabelProps={{
              sx: { transform: "translate(14px, 12px)", fontSize: "0.9rem" },
            }}
            InputProps={{
              ...params.InputProps,
              sx: {
                height: "40px",
                padding: "0 12px",
                display: "flex",
                alignItems: "center",
              },
            }}
          />
        )}
        sx={{
          width: 200,
          "& .MuiOutlinedInput-root": {
            borderRadius: theme.shape.borderRadius,
            padding: "0.1rem",
          },
          "& .MuiAutocomplete-listbox": {
            maxHeight: 200,
            overflow: "auto",
          },
          "& .MuiAutocomplete-option:hover": {
            backgroundColor: theme.palette.primary.light,
            color: "white",
          },
        }}
      />
    </Box>
  );
};
export default AutoCompleteSearch;
