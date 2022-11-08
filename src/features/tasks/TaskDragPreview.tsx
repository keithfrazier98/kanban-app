import { usePreview } from "react-dnd-preview";

export default function TaskPreview() {
  const { display } = usePreview<{ type: string }, HTMLButtonElement>();
}
