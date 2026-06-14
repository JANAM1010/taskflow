import React, { useState } from 'react';
import {DndContext, DragOverlay, closestCorners,PointerSensor, useSensor, useSensors} from '@dnd-kit/core';
import { useBoard } from '../context/BoardContext';
import Column from './Column';
import TaskCard from './TaskCard';

const KanbanBoard = ({ projectId, onTaskClick }) => {
  const { getBoardByProject, getTaskById, addTask, moveTask, deleteTask } = useBoard();
  const [activeTask, setActiveTask] = useState(null);

  const board = getBoardByProject(projectId);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  if (!board) return (
    <div className="flex items-center justify-center h-64 text-gray-400">
      No board found for this project.
    </div>
  );

  const findColumnOfTask = (taskId) => {
    return board.columns.find(col => col.taskIds.includes(taskId));
  };

  const handleDragStart = (event) => {
    const task = getTaskById(event.active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const fromColumn = findColumnOfTask(active.id);
    if (!fromColumn) return;

    const toColumn = board.columns.find(col => col.id === over.id);
    if (toColumn) {
      moveTask(projectId, active.id, fromColumn.id, toColumn.id);
      return;
    }

    const toColumnOfTarget = findColumnOfTask(over.id);
    if (toColumnOfTarget) {
      moveTask(projectId, active.id, fromColumn.id, toColumnOfTarget.id);
    }
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 pb-6 pt-2 w-full h-full">
          {board.columns.map(column => {
            const columnTasks = column.taskIds
              .map(id => getTaskById(id))
              .filter(Boolean);

            return (
              <Column
                key={column.id}
                column={column}
                tasks={columnTasks}
                projectId={projectId}
                onAddTask={(columnId, taskData) => addTask(projectId, columnId, taskData)}
                onDeleteTask={(taskId, columnId) => deleteTask(projectId, columnId, taskId)}
                onTaskClick={onTaskClick}
              />
            );
          })}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeTask ? (
            <div className="rotate-2 opacity-90">
              <TaskCard
                task={activeTask}
                columnId=""
                projectId={projectId}
                onDelete={() => {}}
                onClick={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
};

export default KanbanBoard;