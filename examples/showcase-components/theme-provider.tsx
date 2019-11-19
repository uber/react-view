import * as React from 'react';

export const defaultTheme = {
  background: '#276EF1',
  text: '#FFF',
};

export const ThemeContext = React.createContext(defaultTheme);

type TThemeProviderProps = {
  children: React.ReactNode;
  colors?: {
    background?: string;
    text?: string;
  };
};

const ThemeProvider: React.FC<TThemeProviderProps> = ({children, colors}) => {
  return (
    <ThemeContext.Provider value={{...defaultTheme, ...(colors ? colors : {})}}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
