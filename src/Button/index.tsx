import React from "react";

import "./style.css";

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  color = "black",
  type = "button",
  ...props
}) => (
  <button
    className={`${className} Button Button_${color}`}
    type={type}
    {...props}
  >
    {children}
  </button>
);

const ButtonUnobstrusive: React.FC<React.ButtonHTMLAttributes<
  HTMLButtonElement
>> = ({ children, className, type = "button", ...props }) => (
  <button className={`${className} Button_unobtrusive`} type={type} {...props}>
    {children}
  </button>
);

export { ButtonUnobstrusive };

export default Button;
