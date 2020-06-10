import React from "react";
import { GET_APP_ID } from "./../context/App";

const PottoTheme = React.lazy(() => import("./PottoTheme"));
const SpacoTheme = React.lazy(() => import("./SpacoTheme"));

const ThemeSelector: React.FC = ({ children }) => (
    <>
        {/* Conditionally render theme, based on the current client context */}
        <React.Suspense fallback={() => null}>
            {GET_APP_ID === "potto" && <PottoTheme />}
            {GET_APP_ID === "spacospy" && <SpacoTheme />}
        </React.Suspense>
        {/* Render children immediately! */}
        {children}
    </>
);

export default ThemeSelector;
