import { useAppContext } from "../context/appContext";

const Nav = () => {

  const {
    tables,
    handleTableSelect
  } = useAppContext();


  return(
    <aside className="flex px-2 flex-col items-center w-40 h-full overflow-hidden text-indigo-300 bg-indigo-900 rounded">
      <h2 className="text-xl font-bold pt-4">Tables</h2>
      <div className="flex flex-col items-center w-full mt-3 border-t border-gray-300">
        <ul className="mt-4">
          {tables.map((tableName: string) => (
            <li className="mr-6"  key={tableName} onClick={() => handleTableSelect(tableName)}>
              <a className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-indigo-700">{tableName}</a>
            </li>
          ))}
        </ul>
      </div>
  </aside>
  )
};

export default Nav;