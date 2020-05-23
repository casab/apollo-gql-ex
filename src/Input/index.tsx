import React from "react";

import "./style.css";

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  children,
  color = "black",
  ...props
}) => (
  <input className={`Input Input_${color}`} {...props}>
    {children}
  </input>
);

export default Input;
