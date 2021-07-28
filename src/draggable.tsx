import { DragEvent, DragEventHandler } from "react";

function onDragStart(event: DragEvent, data: any) {
  if (!data) {
    return
  }
  event.dataTransfer.setData('text/plain', JSON.stringify(data));
}

type DragConfig = {
  key?: string,
  config?: Record<string, string>,
  draggable?: boolean,
  onDragStart?: DragEventHandler,
  onDragOver?: DragEventHandler,
  onDrop?: DragEventHandler,
}
const draggable = (component: Function, data?: DragConfig) => {
  return (
    <div
      className="draggable-wrapper"
      key={data?.key}
      draggable={!!data?.draggable}
      onDragStart={data?.onDragStart || ((e) => onDragStart(e, data?.config))}
      onDragOver={data?.onDragOver}
      onDrop={data?.onDrop}
    >{component()}</div>
  )
}

export default draggable;
