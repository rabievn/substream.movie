"use client";

import { useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./store";

interface StoreProviderProps {
  children: ReactNode;
}

/**
 * Creates the store once per client tree. `useState` with a lazy initializer is the
 * React 19-safe equivalent of the `useRef` pattern (refs can't be read during render).
 */
export function StoreProvider({ children }: StoreProviderProps) {
  const [store] = useState(makeStore);
  return <Provider store={store}>{children}</Provider>;
}
