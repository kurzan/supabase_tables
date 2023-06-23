import { useEffect, useState } from "react";
import { useAppContext } from "../context/appContext";
import { findTable } from "../utils/utils";

const Table = () => {
  const [currentColumns, setCurrentColumns] = useState([]);
  const [foreignTableData, setForeignTableData] = useState({});
  const {
    supabase,
    tables,
    updateCellValue,
    selectedTable,
    tableRows,
    columnNames,
    isLoading,
  } = useAppContext();

  useEffect(() => {
    const foreignKeyColumns = columnNames.filter((column) => column.is_foreign_key);
    const columns = foreignKeyColumns.map((column) => column.column_name);
    //@ts-ignore
    setCurrentColumns(columns);
  }, [columnNames]);

  const fetchForeignTableData = async (tableName: any) => {
    try {
      const { data, error } = await supabase.from(tableName).select("*");

      if (error) {
        throw new Error(error.message);
      }

      setForeignTableData((prevState) => ({
        ...prevState,
        [tableName]: data,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (currentColumns.length > 0) {
      currentColumns.forEach((column) => {
        const foreignTable = findTable(column, tables);
        fetchForeignTableData(foreignTable);
      });
    }
  }, [currentColumns, tables]);

  return (
    <div className="">
      <h2 className="text-xl font-bold">Table Editor {selectedTable}</h2>
      {!selectedTable && !isLoading && <p>Select table</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className="border-collapse border border-slate-400 mt-4">
          <thead>
            <tr>
              {selectedTable &&
                columnNames.map((column) => (
                  <th className="border border-slate-300" key={column.column_name}>
                    {column.column_name}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {tableRows &&
              tableRows.map((row: any, rowIndex: any) => (
                <tr key={rowIndex}>
                  {Object.entries(row).map(([columnName, value]) => {
                    const currentColumn = columnNames.find((column) => column.column_name === columnName);

                    if (currentColumn?.is_foreign_key) {
                      const foreignTable = findTable(columnName, tables);
                      //@ts-ignore
                      const foreignTableRows = foreignTableData[foreignTable] || [];

                      return (
                        <td className="border border-slate-300" key={columnName}>
                          <select
                          //@ts-ignore
                            value={value}
                            onChange={(e) => updateCellValue(rowIndex, columnName, e.target.value)}
                          >
                            {foreignTableRows.map((row: any) => (
                              <option key={row.id} value={row.id}>
                                {row.name}
                              </option>
                            ))}
                          </select>
                        </td>
                      );
                    }

                    return (
                      <td className="border border-slate-300" key={columnName}>
                        <input
                          type="text"
                          //@ts-ignore
                          value={value}
                          onChange={(e) => updateCellValue(rowIndex, columnName, e.target.value)}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Table;
