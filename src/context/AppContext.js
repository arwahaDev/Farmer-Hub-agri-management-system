import { createContext, useContext } from "react";

export const AppContext = createContext(null);

export function useAppContext() {
  const context = useContext(AppContext);

  if (context === null) {
    throw new Error(
      "useAppContext must be used inside AppProvider."
    );
  }

  return context;
}