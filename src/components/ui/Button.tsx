import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  to?: string;
  href?: string;
  target?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  to,
  href,
  target,
  onClick,
  type = 'button',
  className = '',
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-xl
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    ${fullWidth ? 'w-full' : ''}
  `;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25
      hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-500/30
      focus:ring-blue-500 active:scale-95
    `,
    secondary: `
      bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg shadow-slate-500/25
      hover:from-slate-700 hover:to-slate-800 hover:shadow-xl hover:shadow-slate-500/30
      focus:ring-slate-500 active:scale-95
    `,
    success: `
      bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-500/25
      hover:from-green-700 hover:to-green-800 hover:shadow-xl hover:shadow-green-500/30
      focus:ring-green-500 active:scale-95
    `,
    warning: `
      bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg shadow-orange-500/25
      hover:from-orange-700 hover:to-orange-800 hover:shadow-xl hover:shadow-orange-500/30
      focus:ring-orange-500 active:scale-95
    `,
    error: `
      bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/25
      hover:from-red-700 hover:to-red-800 hover:shadow-xl hover:shadow-red-500/30
      focus:ring-red-500 active:scale-95
    `,
    ghost: `
      text-slate-700 hover:bg-slate-100 hover:text-slate-900
      focus:ring-slate-500 active:scale-95
    `,
    outline: `
      border-2 border-slate-300 text-slate-700 bg-white
      hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900
      focus:ring-slate-500 active:scale-95
    `,
  };

  const classes = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `.trim();

  const LoadingSpinner = () => (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const content = (
    <>
      {loading && <LoadingSpinner />}
      {!loading && icon && iconPosition === 'left' && icon}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && icon}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target={target} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
    >
      {content}
    </button>
  );
};