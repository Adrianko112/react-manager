import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TaskItem from './TaskItem'

export default function SortableTaskItem(props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props.task.id,
  })

  return (
    <TaskItem
      {...props}
      innerRef={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      handle={{ ...attributes, ...listeners }}
      isDragging={isDragging}
    />
  )
}
