import React from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
  variant?:
    | 'primary'
    | 'brand'
    | 'danger'
    | 'success'
    | 'warning'
    | 'outline-primary';
  square?: boolean;
  paddingLess?: boolean;
}

const Button = ({
  className,
  children,
  variant,
  square,
  paddingLess,
  type = 'button',
  disabled,
  ...props
}: ButtonProps) => {
  const getVariant = () => {
    if (disabled) {
      return 'bg-gray-200 text-gray-500 cursor-not-allowed';
    }
    switch (variant) {
      case 'brand':
        return 'bg-primary hover:bg-indigo-600 text-white';
      case 'outline-primary':
        return 'bg-white text-gray-500 border border-gray-400 hover:text-gray-500 hover:bg-indigo-50';
    }
  };

  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      className={`
        ${getVariant()} transition duration-500 ${
          !paddingLess && 'py-2 px-4'
        } ${!square && 'rounded-md'} active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
