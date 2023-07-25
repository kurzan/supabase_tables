import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { TColumnNames, TTableRow } from "../utils/types";

type TContext = {
  columnNames: TColumnNames[],
  handleTableSelect: (tableName: string) => void,
  updateCellValue: (rowIndex: number, columnName: string, newValue: string) => Promise<void>,
  supabase:  SupabaseClient,
  tables: string[],
  selectedTable: string,
  tableRows: TTableRow[],
  isLoading: boolean,
  fetchTableData: any
}

const AppContext = createContext({} as TContext);

const AppContextProvider = ({children}: {children: ReactNode}) => {
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL as string;
  const supabaseKey = process.env.REACT_APP_SUPABASE_KEY as string;

  const supabase = createClient(supabaseUrl, supabaseKey
  );

  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [tableRows, setTableRows] = useState<TTableRow[]>([]);
  const [columnNames, setColumnNames] = useState<TColumnNames[]>([]);
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

      setTables(data.map(({name}:{name: string}) => name));

    } catch (error) {
      console.error(error);
    }
  };

  const fetchTableData = async (tableName: string) => {
    try {
      setIsLoading(true);

      const { data: tabelRows, error: tableRowsError } = await supabase.from(tableName).select('*').order('id');
      const { data: columnNames, error: columnsNamesError } = await supabase.rpc('get_columns_info', { table_name: `${tableName}` });

      if (columnsNamesError || tableRowsError) {
        throw new Error(columnsNamesError?.message || tableRowsError?.message);
      }

      setColumnNames(columnNames as TColumnNames[]);
      setTableRows(tabelRows);
      setIsLoading(false);

    } catch (error) {
      setIsLoading(false);
    }
  };


  const handleTableSelect = (tableName: string) => {
    setSelectedTable(tableName);
    fetchTableData(tableName);
  };

  const updateCellValue = async (rowIndex: number, columnName: string, newValue: string) => {
    try {
      const updatedData: TTableRow[] = [...tableRows];
      //@ts-ignore
      updatedData[rowIndex][columnName] = newValue;
  
      const { error } = await supabase
        .from(selectedTable)
        .update({ [columnName]: newValue })
        .eq('id', updatedData[rowIndex]['id']);
  
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
        updateCellValue,
        handleTableSelect,
        fetchTableData,
        supabase,
        tables,
        selectedTable,
        tableRows,
        columnNames,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );

};

const useAppContext = () => useContext(AppContext);

export { AppContext as default, AppContextProvider, useAppContext };

