import { useState, createContext } from 'react';

export const NavigationOptionsContext = createContext()

export const NavigationOptionsProvider = ({ children }) => {
  const [tabSetOptions, setTabSetOptions] = useState(() => () => {});
  return (
    <NavigationOptionsContext.Provider value={{ tabSetOptions, setTabSetOptions }}>
      {children}
    </NavigationOptionsContext.Provider>
  );
};