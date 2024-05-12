import { useContext } from "react";
import { AppContext } from "./AppContext";

// create a hook to use the contextProvider
export const useAppContext = () => {
  const context = useContext(AppContext);
  return context as AppContext;
};
