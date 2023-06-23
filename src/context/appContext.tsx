import { ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { TColumnNames } from "../utils/types";

type TContext = {
  columnNames: TColumnNames[],
  fetchTableData: any,
  handleTableSelect: any,
  updateCellValue: any,
  supabase: any,
  tables: any,
  selectedTable: any,
  tableRows: any,
  isLoading: any,
  setSelectedTable: any,
  setTableRows: any,
  setColumnNames: any,
  setIsLoading: any
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
  
      setTables(data.map((table: any) => table.name));

    } catch (error) {
      console.error(error);
    }
  };

  const fetchTableData = async (tableName: any) => {
    try {
      setIsLoading(true);

      const { data: tabelRows, error: tableRowsError } = await supabase.from(tableName).select('*');
      const { data: columnNames, error: columnsNamesError } = await supabase.rpc('get_columns_info', { table_name: `${tableName}` });

      if (columnsNamesError || tableRowsError) {
        throw new Error(columnsNamesError?.message || tableRowsError?.message);
      }

      setColumnNames(columnNames);
      //@ts-ignore
      setTableRows(tabelRows);
      setIsLoading(false);

    } catch (error) {
      setIsLoading(false);
    }
  };


  const handleTableSelect = (tableName: any) => {
    setSelectedTable(tableName);
    fetchTableData(tableName);
  };

  const updateCellValue = async (rowIndex: any, columnName: any, newValue: any) => {
    try {
      const updatedData = [...tableRows];
      //@ts-ignore
      updatedData[rowIndex][columnName] = newValue;
  
      const { data: updatedRow, error } = await supabase
        .from(selectedTable)
        .update({ [columnName]: newValue })
        //@ts-ignore
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

