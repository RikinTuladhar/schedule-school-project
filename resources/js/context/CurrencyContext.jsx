import { createContext, useContext, useEffect, useState } from "react";

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
};

const currencies = {
  USD: {
    symbol: "$",
    name: "US Dollar",
    rate: 1,
  },
  GBP: {
    symbol: "£",
    name: "British Pound",
    rate: 0.79, // 1 USD = 0.79 GBP (approximate)
  },
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    // Load from localStorage on init
    const saved = localStorage.getItem("currency");
    return saved || "USD";
  });

  // Save to localStorage whenever currency changes
  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  const formatPrice = (price) => {
    const currencyData = currencies[currency];
    const convertedPrice = price * currencyData.rate;
    return `${currencyData.symbol}${convertedPrice.toFixed(2)}`;
  };

  const changeCurrency = (newCurrency) => {
    if (currencies[newCurrency]) {
      setCurrency(newCurrency);
    }
  };

  const getCurrencySymbol = () => {
    return currencies[currency].symbol;
  };

  const convertPrice = (price) => {
    return price * currencies[currency].rate;
  };

  const value = {
    currency,
    changeCurrency,
    formatPrice,
    getCurrencySymbol,
    convertPrice,
    currencies,
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};
