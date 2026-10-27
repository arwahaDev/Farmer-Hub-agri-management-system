export const SET_INVENTORY = "inventory/SET_INVENTORY";
export const ADD_INVENTORY_ITEM = "inventory/ADD_INVENTORY_ITEM";
export const UPDATE_INVENTORY_ITEM = "inventory/UPDATE_INVENTORY_ITEM";
export const DELETE_INVENTORY_ITEM = "inventory/DELETE_INVENTORY_ITEM";

export const setInventory = (items) => ({
  type: SET_INVENTORY,
  payload: items,
});

export const addInventoryItem = (item) => ({
  type: ADD_INVENTORY_ITEM,
  payload: item,
});

export const updateInventoryItem = (item) => ({
  type: UPDATE_INVENTORY_ITEM,
  payload: item,
});

export const deleteInventoryItem = (id) => ({
  type: DELETE_INVENTORY_ITEM,
  payload: id,
});