const activityLogger = (storeAPI) => (next) => (action) => {
  const result = next(action);

  const actionType = action.type || "";

  const isRecordAction = /\/(add|update|edit|remove|delete)($|\/)/i.test(
    actionType
  );

  if (isRecordAction) {
    try {
      const state = storeAPI.getState();
      const activities = state.activity || [];

      const activity = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        user: state.auth?.user || "System",
        action: actionType,
        entity: actionType.split("/")[0],
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem(
        "agri_activity",
        JSON.stringify([activity, ...activities])
      );
    } catch (error) {
      console.error("Failed to log activity:", error);
    }
  }

  return result;
};

export default activityLogger;