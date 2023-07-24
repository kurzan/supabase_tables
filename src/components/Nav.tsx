import { useAppContext } from "../context/appContext";

const Nav = () => {

  const {
    tables,
    handleTableSelect
  } = useAppContext();


  return(
    <div className="w-64">
      <h2 className="text-xl font-bold">Tables</h2>
      <ul className="mt-4">
        {tables.map((tableName: any) => (
          <li className="mr-6"  key={tableName} onClick={() => handleTableSelect(tableName)}>
            <a className="text-blue-500 hover:text-blue-800">{tableName}</a>
          </li>
        ))}
      </ul>
  </div>
  )
};

export default Nav;