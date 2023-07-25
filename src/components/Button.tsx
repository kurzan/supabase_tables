import React from 'react';

type TButton = {
  title: string,
  onClick: () => void,
  type?: "button" | "submit" | "reset" | undefined,
  style?: React.CSSProperties | undefined
};

const Button = ({title, onClick, type = "button", style} : TButton) => {
  return (
    <button style={style} type={type} className="h-12 px-3 mt-2 rounded bg-gray-900 text-gray-400 hover:bg-gray-700" onClick={onClick}>{title}</button>
  );
}

export default Button;