import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAppContext } from './context/appContext';


function App() {

  const {
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
  } = useAppContext();

  return (
    <div>
      <div>
        <h2>Tables</h2>
        <ul>
          {tables.map((tableName) => (
            <li key={tableName} onClick={() => handleTableSelect(tableName)}>
              {tableName}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Table Editor</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                {selectedTable &&
                  columnNames.map((column) => <th key={column.column_name}>{column.column_name}</th>)}
              </tr>
            </thead>
            <tbody>
              {tableRows && tableRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.entries(row).map(([columnName, value]) => (
                <td key={columnName}>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateCellValue(rowIndex, columnName, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
