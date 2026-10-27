import TaskForm from "../components/tasks/TaskForm";
import TaskList from "../components/tasks/TaskList";

export default function Tasks() {
  return (
    <main className="tasks-page">
      <h2>Farm Tasks</h2>

      <TaskForm />
      <TaskList />
    </main>
  );
}