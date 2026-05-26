import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CartProvider } from "./context/CartContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { LanguageProvider } from "./context/LanguageContext";
import MyRouter from "./router/MyRouter";

createRoot(document.getElementById("app")).render(
    <StrictMode>
        <LanguageProvider>
            <CurrencyProvider>
                <CartProvider>
                    <MyRouter />
                </CartProvider>
            </CurrencyProvider>
        </LanguageProvider>
    </StrictMode>
);
