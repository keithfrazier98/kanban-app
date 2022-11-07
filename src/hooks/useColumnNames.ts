import { useMemo } from "react";
import { useAppSelector } from "../app/hooks";
import { getSelectedBoard } from "../features/boards/boardsSlice";
import { useGetColumnsQuery } from "../features/columns/columnsEndpoints";

export default function useColumnNames() {
  const selectedBoard = useAppSelector(getSelectedBoard);

  const { data: columns } = useGetColumnsQuery(selectedBoard?.id);

  const columnNames: [string, string][] = useMemo(() => {
    if (columns?.entities) {
      return Object.values(columns?.entities).map((col) => [
        col?.name || "",
        col?.id || "",
      ]);
    } else {
      return [];
    }
  }, [columns]);

  return { columnNames, columns };
}
