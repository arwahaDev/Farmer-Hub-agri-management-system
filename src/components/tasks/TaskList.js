import { useDispatch, useSelector } from "react-redux";
import {
  updateTask,
  deleteTask,
} from "../../store/actions/taskActions";

function TaskList() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks || []);

  const toggleTask = (task) => {
    dispatch(
      updateTask({
        id: task.id,
        updates: { completed: !task.completed },
      })
    );
  };

  const handleDelete = (id) => {
    dispatch(deleteTask(id));
  };

  return (
    <div>
      <h2>Task List</h2>

      {tasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        tasks.map((task) => (
          <div key={task.id}>
            <input
              type="checkbox"
              checked={Boolean(task.completed)}
              onChange={() => toggleTask(task)}
            />

            <span
              style={{
                textDecoration: task.completed
                  ? "line-through"
                  : "none",
              }}
            >
              {task.title}
            </span>

            <p>Due Date: {task.dueDate || "Not set"}</p>
            <p>Priority: {task.priority}</p>

            <button onClick={() => handleDelete(task.id)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default TaskList;