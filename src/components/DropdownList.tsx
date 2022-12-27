/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { classNames } from "../utils/utils";
import { ChevronDown } from "tabler-icons-react";

export default function DropdownList({
  items,
  selected,
  label,
  onChange,
  testid,
}: {
  items: [string, string][];
  selected: string;
  label: string;
  onChange: (selected: string) => void;
  testid?: string;
}) {
  return (
    <Listbox
      value={selected}
      onChange={(e) => {
        console.log(e);
        onChange(e);
      }}
    >
      {({ open }) => (
        <>
          <Listbox.Label className="modalSubtitle mt-6 dark:text-white">
            {label}
          </Listbox.Label>
          <div className="relative mt-1">
            <Listbox.Button
              className={classNames(
                "relative w-full cursor-default rounded-md border",
                "sm:text-sm dark:bg-transparent",
                "py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-1",
                "hover:border-indigo-500 border-gray-300",
                "bg-white focus:border-indigo-500",
                "dark:text-white group hover:ring-indigo-500",
                "focus:ring-indigo-500 dark:border-primary-gray-500"
              )}
            >
              <span className="block truncate">{selected}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDown
                  size={20}
                  className="text-gray-400 group-hover:text-primary-indigo-active"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                className={classNames(
                  "absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md",
                  "bg-white py-1 text-base shadow-lg ring-1 ring-black",
                  "ring-opacity-5 focus:outline-none sm:text-sm dark:bg-primary-gray-700"
                )}
              >
                {items.map((item, i) => {
                  const [name, id] = item;
                  return (
                    <Listbox.Option
                      data-testid={`status_${name}`}
                      key={`status-${i}`}
                      className={({ active }) =>
                        classNames(
                          active
                            ? "text-black bg-opacity-25 bg-primary-indigo-inactive"
                            : "text-primary-gray-400",
                          "relative cursor-default dark:hover:text-white text-xs select-none py-2 pl-3 pr-9"
                        )
                      }
                      value={id}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? "font-semibold" : "font-normal",
                              "block truncate"
                            )}
                          >
                            {name}
                          </span>
                        </>
                      )}
                    </Listbox.Option>
                  );
                })}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
