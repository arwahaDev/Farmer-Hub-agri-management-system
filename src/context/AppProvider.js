import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { AppContext } from "./AppContext";

import {
  getCrops,
  getBuyers,
  getOrders,
  saveCrops,
  saveBuyers,
  saveOrders,
} from "../services/storageService";

export default function AppProvider({ children }) {
  const [crops, setCrops] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((currentMode) => !currentMode);
  }, []);

  const loadData = useCallback(() => {
    setLoading(true);
    setError("");

    try {
      setCrops(getCrops());
      setBuyers(getBuyers());
      setOrders(getOrders());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load saved project data."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addCrop = useCallback((crop) => {
    const newCrop = {
      ...crop,
      id: crop.id ?? crypto.randomUUID(),
    };

    setCrops((current) => {
      const updated = [...current, newCrop];
      saveCrops(updated);
      return updated;
    });

    return newCrop;
  }, []);

  const updateCrop = useCallback((id, updates) => {
    const current = getCrops();
    let found = false;

    const updated = current.map((crop) => {
      if (String(crop.id) !== String(id)) return crop;

      found = true;
      return { ...crop, ...updates, id: crop.id };
    });

    if (!found) throw new Error("Crop not found.");

    saveCrops(updated);
    setCrops(updated);
  }, []);

  const deleteCrop = useCallback((id) => {
    const current = getCrops();
    const updated = current.filter(
      (crop) => String(crop.id) !== String(id)
    );

    if (updated.length === current.length) {
      throw new Error("Crop not found.");
    }

    saveCrops(updated);
    setCrops(updated);
  }, []);

  const addBuyer = useCallback((buyer) => {
    const newBuyer = {
      ...buyer,
      id: buyer.id ?? crypto.randomUUID(),
    };

    setBuyers((current) => {
      const updated = [...current, newBuyer];
      saveBuyers(updated);
      return updated;
    });

    return newBuyer;
  }, []);

  const updateBuyer = useCallback((id, updates) => {
    const current = getBuyers();
    let found = false;

    const updated = current.map((buyer) => {
      if (String(buyer.id) !== String(id)) return buyer;

      found = true;
      return { ...buyer, ...updates, id: buyer.id };
    });

    if (!found) throw new Error("Buyer not found.");

    saveBuyers(updated);
    setBuyers(updated);
  }, []);

  const deleteBuyer = useCallback((id) => {
    const current = getBuyers();
    const updated = current.filter(
      (buyer) => String(buyer.id) !== String(id)
    );

    if (updated.length === current.length) {
      throw new Error("Buyer not found.");
    }

    saveBuyers(updated);
    setBuyers(updated);
  }, []);

  const addOrder = useCallback((order) => {
    const newOrder = {
      ...order,
      id: order.id ?? crypto.randomUUID(),
    };

    setOrders((current) => {
      const updated = [...current, newOrder];
      saveOrders(updated);
      return updated;
    });

    return newOrder;
  }, []);

  const updateOrder = useCallback((id, updates) => {
    const current = getOrders();
    let found = false;

    const updated = current.map((order) => {
      if (String(order.id) !== String(id)) return order;

      found = true;
      return { ...order, ...updates, id: order.id };
    });

    if (!found) throw new Error("Order not found.");

    saveOrders(updated);
    setOrders(updated);
  }, []);

  const deleteOrder = useCallback((id) => {
    const current = getOrders();
    const updated = current.filter(
      (order) => String(order.id) !== String(id)
    );

    if (updated.length === current.length) {
      throw new Error("Order not found.");
    }

    saveOrders(updated);
    setOrders(updated);
  }, []);

  const value = {
    crops,
    buyers,
    orders,
    loading,
    error,
    darkMode,
    toggleDarkMode,
    reloadData: loadData,
    addCrop,
    updateCrop,
    deleteCrop,
    addBuyer,
    updateBuyer,
    deleteBuyer,
    addOrder,
    updateOrder,
    deleteOrder,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}