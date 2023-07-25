import { useAppContext } from "../context/appContext";

const Nav = () => {

  const {
    tables,
    handleTableSelect,
    selectedTable
  } = useAppContext();


  return (
    <aside className="flex px-2 flex-col items-center min-w-40 basis-1/4 h-full overflow-hidden text-gray-400 bg-gray-900 rounded">
      <div className="flex items-center pt-4">
        <svg className="w-8 h-8 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
        </svg>
        <h2 className="text-xl font-bold">Tables</h2>
      </div>
      <div className="flex flex-col items-center w-full mt-3 border-t border-gray-500">
        <ul className="mt-4">
          {tables.map((tableName: string) => (
            <li className="mr-6" key={tableName} onClick={() => handleTableSelect(tableName)}>
              <a className={`flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 ${selectedTable === tableName ? "bg-gray-700" : ""}`}>{tableName}</a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
};

export default Nav;