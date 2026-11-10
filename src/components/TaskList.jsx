import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import TaskItem from './TaskItem'
import SortableTaskItem from './SortableTaskItem'

// Il trascinamento è attivo solo se "canReorder" è true
// (ordine manuale e nessun filtro attivo).
export default function TaskList({ tasks, canReorder, onReorder, ...handlers }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  if (!canReorder) {
    return (
      <ul className="space-y-2">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} {...handlers} />
        ))}
      </ul>
    )
  }

  function handleDragEnd({ active, over }) {
    if (over && active.id !== over.id) onReorder(active.id, over.id)
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <SortableTaskItem key={task.id} task={task} {...handlers} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}
