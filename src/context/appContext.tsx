import { ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { TColumnNames } from "../utils/types";

type TContext = {
  columnNames: TColumnNames[]
}

const AppContext = createContext({} as TContext);

const AppContextProvider = ({children}: {children: ReactNode}) => {
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL as string;
  const supabaseKey = process.env.REACT_APP_SUPABASE_KEY as string;

  const supabase = createClient(supabaseUrl, supabaseKey
  );

  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [tableRows, setTableRows] = useState([]);
  const [columnNames, setColumnNames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const { data, error } = await supabase.rpc('get_tables');
  
      if (error) {
        throw new Error(error.message);
      }
  
      setTables(data.map((table) => table.name));

    } catch (error) {
      console.error(error);
    }
  };

  const fetchTableData = async (tableName) => {
    try {
      setIsLoading(true);

      const { data: tabelRows, error: tableRowsError } = await supabase.from(tableName).select('*');
      const { data: columnNames, error: columnsNamesError } = await supabase.rpc('get_columns_info', { table_name: `${tableName}` });

      if (columnsNamesError || tableRowsError) {
        throw new Error(columnsNamesError?.message || tableRowsError?.message);
      }

      setColumnNames(columnNames);
      setTableRows(tabelRows);
      setIsLoading(false);

    } catch (error) {
      setIsLoading(false);
    }
  };


  const handleTableSelect = (tableName) => {
    setSelectedTable(tableName);
    fetchTableData(tableName);
  };

  const updateCellValue = async (rowIndex, columnName, newValue) => {
    try {
      const updatedData = [...tableRows];

      updatedData[rowIndex][columnName] = newValue;
  
      const { data: updatedRow, error } = await supabase
        .from(selectedTable)
        .update({ [columnName]: newValue })
        .eq('id', updatedData[rowIndex].id);
  
      if (error) throw error;
  
      setTableRows(updatedData);
  
      console.log('Cell value updated');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        fetchTableData,
        handleTableSelect,
        updateCellValue,
        supabase,
        tables,
        selectedTable,
        tableRows,
        columnNames,
        isLoading,
        setSelectedTable,
        setTableRows,
        setColumnNames,
        setIsLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );

};


const useAppContext = () => useContext(AppContext);

export { AppContext as default, AppContextProvider, useAppContext };

