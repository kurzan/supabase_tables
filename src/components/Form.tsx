import React, { useState, useEffect } from 'react';
import Button from './Button';
import { useAppContext } from '../context/appContext';
import { PostgrestError } from '@supabase/supabase-js';

type TForm = {
  title: string,
  handleForm: () => void
}

const Form = ({ title, handleForm }: TForm) => {

  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<PostgrestError>();

  const {
    columnNames,
    supabase,
    selectedTable,
    fetchTableData
  } = useAppContext();

  const addData = async () => {
    try {
      setIsError(false);

      const { data, error } = await supabase
        .from(selectedTable)
        .insert([{ id: 7, name: "1" }]);
  
      if (error) {
        console.error(error);
        setError(error);
        setIsError(true);
        return;
      }

      handleForm();
      fetchTableData(selectedTable);
  
      console.log('Record created successfully:', data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='pt-6'>
      <h2 className="text-xl font-bold">{title}</h2>
      <form action="" className='pt-2'>
        <div className='flex flex-col gap-2'>
          <div className='flex flex-col gap-2'>
            {columnNames && columnNames.map((field) => field.column_name !== "id" ? <input className='h-8 rounded' key={field.column_name} placeholder={field.column_name} /> : null)}
            {isError && <p className='text-red-700'>{error?.message}</p>}
          </div>
          <Button style={{ backgroundColor: 'green' }} title="Confirm" onClick={addData} />
          <Button style={{ backgroundColor: 'red' }} title="Cancel" onClick={handleForm} />
        </div>
      </form>
    </div>
  );
}

export default Form;