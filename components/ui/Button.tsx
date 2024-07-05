import React from "react";

export interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
  variant?:
    | "primary"
    | "danger"
    | "success"
    | "warning"
    | "outline-danger"
    | "outline-warning"
    | "outline-success"
    | "outline-primary";
  square?: boolean;
  paddingLess?: boolean;
}

const Button = ({
  className,
  children,
  variant,
  square,
  paddingLess,
  type = "button",
  disabled,
  ...props
}: IButtonProps) => {
  const getVariant = () => {
    if (disabled) {
      return "bg-gray-300 text-gray-500 cursor-not-allowed";
    }
    switch (variant) {
      case "primary":
        return "bg-gray-500 hover:bg-gray-700 text-white";
      case "danger":
        return "bg-red-500 hover:bg-red-700 text-white";
      case "success":
        return "bg-green-500 hover:bg-green-700 text-white";
      case "warning":
        return "bg-amber-500 hover:bg-amber-700 text-white";
      case "outline-danger":
        return "bg-white text-red-500 border border-red-500 hover:text-white hover:bg-red-700";
      case "outline-success":
        return "bg-white text-green-500 border border-green-500 hover:text-white hover:bg-green-700";
      case "outline-warning":
        return "bg-white text-amber-400 border border-amber-500 hover:text-white hover:bg-amber-500";
      case "outline-primary":
        return "bg-white text-gray-500 border border-gray-500 hover:text-white hover:bg-gray-700";
      default:
        return "bg-gray-500 hover:bg-gray-700 text-white shadow shadow-gray-600/25 hover:shadow-gray-600/75";
    }
  };

  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      className={`
        ${getVariant()} transition duration-500 ${
          !paddingLess && "py-2 px-4"
        } ${!square && "rounded-md"} active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
