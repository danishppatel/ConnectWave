import { EuiThemeColorMode } from '@elastic/eui';
import React, { Suspense, useEffect, useState } from 'react';

const LightTheme = React.lazy(() => import("./Themes/LightTheme"));
const DarkTheme = React.lazy(() => import("./Themes/DarkTheme"));

const ThemeSelector = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
    
    const [theme, setTheme] = useState<EuiThemeColorMode>("light");
    
    useEffect(() => {
      const theme = localStorage.getItem("connectwave-theme");
      if (theme) {
        setTheme(theme as EuiThemeColorMode);
      }
    }, []);
  
  return (
    <>
        <Suspense fallback={<></>}>
             {theme === "dark" ? <DarkTheme /> : <LightTheme />}
        </Suspense>
        {children}
    </>
  )
}

export default ThemeSelector;