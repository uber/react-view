/*
Copyright (c) 2020 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
import * as React from "react";

export const defaultTheme = {
  background: "#276EF1",
  text: "#FFF",
};

export const ThemeContext = React.createContext(defaultTheme);

type TThemeProviderProps = {
  children: React.ReactNode;
  colors?: {
    background?: string;
    text?: string;
  };
};

const ThemeProvider: React.FC<TThemeProviderProps> = ({ children, colors }) => {
  return (
    <ThemeContext.Provider
      value={{ ...defaultTheme, ...(colors ? colors : {}) }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
