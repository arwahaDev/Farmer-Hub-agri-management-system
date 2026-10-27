const CROPS_KEY = "agri_crops";
const BUYERS_KEY = "agri_buyers";
const ORDERS_KEY = "agri_orders";

function readData(key) {
  try {
    const savedData = localStorage.getItem(key);

    if (savedData === null) {
      return [];
    }

    const parsedData = JSON.parse(savedData);

    if (!Array.isArray(parsedData)) {
      throw new Error(`Invalid data format for ${key}.`);
    }

    return parsedData;
  } catch (error) {
    console.error(`Unable to read ${key}:`, error);
    throw new Error(
      `Could not load saved data for ${key}. Please check browser storage.`
    );
  }
}

function writeData(key, data) {
  if (!Array.isArray(data)) {
    throw new Error("Only arrays can be saved.");
  }

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Unable to save ${key}:`, error);
    throw new Error(
      `Could not save ${key}. Browser storage may be full or unavailable.`
    );
  }
}

// Crops
export function getCrops() {
  return readData(CROPS_KEY);
}

export function saveCrops(crops) {
  writeData(CROPS_KEY, crops);
}

// Buyers
export function getBuyers() {
  return readData(BUYERS_KEY);
}

export function saveBuyers(buyers) {
  writeData(BUYERS_KEY, buyers);
}

// Orders
export function getOrders() {
  return readData(ORDERS_KEY);
}

export function saveOrders(orders) {
  writeData(ORDERS_KEY, orders);
}