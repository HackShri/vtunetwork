import React, { createContext, useContext, useState } from "react";

const FilterContext = createContext(null);

export function FilterProvider({ children }) {
    const [branch, setBranch] = useState("NULL");
    const [semester, setSemester] = useState("Sem 1");
    const [type, setType] = useState("Notes")

    return (
        <FilterContext.Provider value={{ branch, setBranch, semester, setSemester, type, setType }} >
            {children}
        </FilterContext.Provider>
    );
}

export const useFilters = () => useContext(FilterContext);