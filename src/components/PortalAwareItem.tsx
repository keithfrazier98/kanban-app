import {
  Droppable,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import { createPortal } from "react-dom";
import { Component, ReactNode, useState } from "react";
import { IColumn, ITask } from "../@types/types";
import Task from "../features/tasks/Task";

const portal: HTMLElement = document.createElement("div");
document.body.appendChild(portal);

export default function PortalAwareItem({
  provided,
  snapshot,
  children,
}: {
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  children: JSX.Element;
}) {
  const usePortal: boolean = snapshot.isDragging;

  const child: ReactNode = (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      {children}
    </div>
  );

  if (!usePortal) {
    return child;
  }

  // if dragging - put the item in a portal
  return createPortal(child, portal);
}
