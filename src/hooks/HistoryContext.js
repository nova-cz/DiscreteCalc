// HistoryContext.js
import React, { createContext, useState } from "react";

const createHistoryContext = () => {
  const HistoryContext = createContext();

  const HistoryProvider = ({ children }) => {
    const [history, setHistory] = useState([]);

    const addRecordToHistory = (record) => {
      setHistory((prevHistory) => [
        ...prevHistory,
        { ...record, date: new Date() },
      ]);
    };

    return (
      <HistoryContext.Provider value={{ history, addRecordToHistory }}>
        {children}
      </HistoryContext.Provider>
    );
  };

  return { HistoryContext, HistoryProvider };
};

export default createHistoryContext;
