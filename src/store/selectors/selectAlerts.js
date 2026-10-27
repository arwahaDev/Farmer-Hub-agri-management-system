export const selectAlerts = (state) => {
  const alerts = [];

  // Low-stock crop alerts
  const crops = state.crops || [];

  crops.forEach((crop) => {
    const stock = Number(
      crop.quantity ?? crop.stock ?? 0
    );

    const threshold = Number(
      crop.lowStockThreshold ?? 10
    );

    if (stock <= threshold) {
      alerts.push({
        id: `crop-${crop.id}`,
        type: "warning",
        title: "Low Crop Stock",
        message: `${crop.name || "Crop"} stock is low.`,
      });
    }
  });

  // Weather humidity alert
  const humidity =
    state.weather?.data?.current?.relative_humidity_2m;

  if (typeof humidity === "number" && humidity >= 85) {
    alerts.push({
      id: "weather-humidity",
      type: "warning",
      title: "High Humidity",
      message: `Humidity is ${humidity}%. Check crops for moisture-related risks.`,
    });
  }

  // Due task alerts
  const tasks = state.tasks || [];
  const today = new Date().toISOString().slice(0, 10);

  tasks.forEach((task) => {
    const taskDate = task.date || task.dueDate;

    if (
      taskDate &&
      taskDate <= today &&
      task.status !== "Completed"
    ) {
      alerts.push({
        id: `task-${task.id}`,
        type: "warning",
        title: "Task Due",
        message: `${task.title || task.name || "Farm task"} is due.`,
      });
    }
  });

  return alerts;
};