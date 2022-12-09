import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { ArrowBack, X } from "tabler-icons-react";
import { IColumn, IColumnEntities, opTypes } from "../../@types/types";
import { useGetColumnsQuery } from "../columns/columnsEndpoints";
import useSelectedBoard from "../../hooks/useSelectedBoard";

export default function ColumnInput({
  column,
  setNewColumns,
}: {
  column: IColumn;
  setNewColumns: Dispatch<SetStateAction<IColumnEntities>>;
}) {
  const selectedBoard = useSelectedBoard();
  const { data: columns } = useGetColumnsQuery(selectedBoard?.id);

  const getOpType = (val: string): opTypes => {
    if (!columns?.entities[column.id]) {
      return "create";
    }
    if (columns?.entities[column.id].name !== val) {
      return "update";
    } else {
      return undefined;
    }
  };

  const handleDelBtn = () => {
    setNewColumns((prevState) => {
      const { operation } = column;

      switch (operation) {
        case "delete":
          let operation: opTypes = getOpType(column.name);

          return {
            ...prevState,
            [column.id]: {
              ...column,
              operation,
            },
          };
        case "create":
          const keys = Object.keys(prevState || {});
          const newKeys = keys.filter((key) => key !== column.id);
          const newState: IColumnEntities = {};

          newKeys.forEach((key) => {
            newState[key] = prevState[key];
          });

          return newState;
        default:
          return {
            ...prevState,
            [column.id]: {
              ...column,
              operation: "delete",
            },
          };
      }
    });
  };

  const handleType = (e: ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;

    const operation = getOpType(newVal);

    setNewColumns((prevState) => ({
      ...prevState,
      [column.id]: {
        ...column,
        name: newVal,
        operation,
      },
    }));
  };

  return (
    <div className="relative flex items-center my-3">
      {column.operation === "delete" ? (
        <div className="absolute h-[1px] bg-primary-red-active -left-1 right-7" />
      ) : (
        <></>
      )}

      <label className="sr-only">Column {column.name} input</label>
      <input
        type="text"
        data-testid="column_name_input"
        value={column.name}
        className="flex-1 text-sm border rounded px-3 py-2 dark:text-gray-300 dark:border-primary-gray-600 dark:bg-primary-gray-700"
        onChange={handleType}
      />
      <div className="pl-2">
        <button
          data-testid="delete_col_btn"
          className="text-gray-400 w-6 h-6 flex justify-center"
          onClick={handleDelBtn}
        >
          {column.operation === "delete" ? <ArrowBack /> : <X />}
        </button>
      </div>
    </div>
  );
}
