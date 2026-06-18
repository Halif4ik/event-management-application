import * as React from 'react';
import classNames from 'classnames';

interface InputErrorProps {
  message?: string;
  className?: string;
}

export const InputError: React.FC<InputErrorProps> = ({
  message,
  className = '',
}) => {
  if (!message) return null;

  const errorClasses = classNames(
    'text-sm text-red-600 mt-2',
    className
  );

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
      <div className={errorClasses}>{message}</div>
    </div>
  );
};
