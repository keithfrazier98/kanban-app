import { useMemo } from "react";
import { useGetColumnsQuery } from "../features/columns/columnsEndpoints";
import useSelectedBoard from "./useSelectedBoard";

export default function useColumnNames() {
  const selectedBoard = useSelectedBoard();

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
