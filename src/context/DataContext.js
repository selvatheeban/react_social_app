import { createContext,useState , useEffect } from "react";

const DataContext = createContext({})

export const DataProvider =({children}) => {
      const [search,setSearch] = useState('');
    return(

        <DataContext.Provider value={
            {search,setSearch}
        }>
            {children}
        </DataContext.Provider>
    )
}

export default DataContext