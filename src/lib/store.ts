export const currencies = {
    USD: { symbol: "$", locale: "en-US" },
    EUR: { symbol: "€", locale: "de-DE" },
    GBP: { symbol: "£", locale: "en-GB" },
    INR: { symbol: "₹", locale: "en-IN" },
};

export type CurrencyCode = keyof typeof currencies;

export interface AppState {
    principal: number;
    currency: CurrencyCode;
}

const DEFAULT_STATE: AppState = {
    principal: 100000,
    currency: "INR",
};

const LISTENERS = new Set<(state: AppState) => void>();

let currentState: AppState = { ...DEFAULT_STATE };

// Initialize from localStorage if available
if (typeof localStorage !== "undefined") {
    const saved = localStorage.getItem("expense-calculator-state");
    if (saved) {
        try {
            currentState = { ...DEFAULT_STATE, ...JSON.parse(saved) };
        } catch (e) {
            console.error("Failed to parse saved state", e);
        }
    }
}

export function getState(): AppState {
    return { ...currentState };
}

export function setState(newState: Partial<AppState>) {
    currentState = { ...currentState, ...newState };

    if (typeof localStorage !== "undefined") {
        localStorage.setItem("expense-calculator-state", JSON.stringify(currentState));
    }

    LISTENERS.forEach((listener) => listener(currentState));
}

export function subscribe(listener: (state: AppState) => void) {
    LISTENERS.add(listener);
    listener(currentState); // Immediate callback
    return () => LISTENERS.delete(listener);
}

export function formatMoney(amount: number, currencyCode: CurrencyCode = currentState.currency): string {
    const config = currencies[currencyCode];
    return new Intl.NumberFormat(config.locale, {
        style: "currency",
        currency: currencyCode,
        maximumFractionDigits: 0,
    }).format(amount);
}
