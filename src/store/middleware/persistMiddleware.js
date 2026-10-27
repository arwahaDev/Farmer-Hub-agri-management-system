const persistMiddleware = (storeAPI) => (next) => (action) => {
  const result = next(action);

  const state = storeAPI.getState();

  const storageKeys = {
    crops: "agri_crops",
    orders: "agri_orders",
    buyers: "agri_buyers",
    tasks: "agri_tasks",
    expenses: "agri_expenses",
    inventory: "agri_inventory",
  };

  try {
    Object.entries(storageKeys).forEach(([stateKey, storageKey]) => {
      localStorage.setItem(
        storageKey,
        JSON.stringify(state[stateKey])
      );
    });
  } catch (error) {
    console.error("Failed to save data:", error);
  }

  return result;
};

export default persistMiddleware;