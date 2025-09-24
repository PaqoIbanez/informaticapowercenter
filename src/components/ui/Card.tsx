import type { ReactNode } from "react";

interface CardProps {
  title: string;
  titleClassName?: string;
  children: ReactNode;
}

export const Card = ({
  title,
  titleClassName = "text-blue-600",
  children,
}: CardProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h3 className={`text-lg font-semibold ${titleClassName}`}>{title}</h3>
      <div className="text-gray-600 mt-2 space-y-1">{children}</div>
    </div>
  );
};
