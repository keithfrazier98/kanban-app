import { PropsWithChildren } from "react";

export default function HeaderWrapper({ children }: PropsWithChildren) {
  return (
    <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white dark:bg-primary-gray-700 shadow">
      {children}
    </div>
  );
}
