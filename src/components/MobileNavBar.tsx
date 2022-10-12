import { DotsVertical, Plus } from "tabler-icons-react";
import BoardMenu from "./BoardMenu";

export default function MobileNavBar() {
  return (
    <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white dark:bg-primary-gray-700 shadow">
      <div className="flex flex-1 justify-between pl-4 items-center">
        <BoardMenu />
        <div className="flex items-center">
          <button
            type="button"
            className="rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span className="sr-only">View notifications</span>
            <div className="flex items-center">
              <div className="px-3 py-1 rounded-full bg-primary-indigo-active">
                <Plus className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
            </div>
          </button>
          <DotsVertical className="text-gray-400 mr-2" />
        </div>
      </div>
    </div>
  );
}
