export const findTable = (column_name: string, tables: string[]) => {
  const filteredTables = tables.filter(table => column_name.toLowerCase().includes(table.toLowerCase()));
  return filteredTables.length > 0 ? filteredTables[0] : null;
}