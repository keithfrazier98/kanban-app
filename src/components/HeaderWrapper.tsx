import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className: string;
}

export default function HeaderWrapper({ children, className }: Props) {
  return (
    <div
      className={`${className} sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white dark:bg-primary-gray-700 border-b border-primary-gray-300`}
    >
      {children}
    </div>
  );
}
