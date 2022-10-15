import { ReactComponent as MobileLogo } from "../assets/logo-mobile.svg";
/**
 * Static Sidebar for desktop
 * @returns
 */
export default function SideBar() {
  return (
    <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="flex flex-grow flex-col overflow-y-auto bg-indigo-700 pt-5">
        <div className="flex flex-shrink-0 items-center px-4">
          <MobileLogo />
        </div>
        <div className="mt-5 flex flex-1 flex-col"></div>
      </div>
    </div>
  );
}
