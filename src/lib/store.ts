export interface AppState {
    principal: number;
}

const DEFAULT_STATE: AppState = {
    principal: 100000,
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

export function formatMoney(amount: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(amount);
}
