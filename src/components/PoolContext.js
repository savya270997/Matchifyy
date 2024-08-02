import React, { createContext, useState, useContext } from "react";

const PoolContext = createContext();

export const usePool = () => useContext(PoolContext);

export const PoolProvider = ({ children }) => {
  const [pools, setPools] = useState([]);

  const addPool = (pool) => {
    setPools((prevPools) => [...prevPools, pool]);
  };

  return (
    <PoolContext.Provider value={{ pools, addPool }}>
      {children}
    </PoolContext.Provider>
  );
};
