import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "nk_cart_v1";

const loadInitialState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.items)) return { items: [] };
    return parsed;
  } catch (err) {
    console.warn("Could not read cart from localStorage:", err);
    return { items: [] };
  }
};

const lineKey = (id, size) => `${id}__${size || "default"}`;

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, size, quantity } = action.payload;
      const key = lineKey(product.id, size);
      const existing = state.items.find((i) => i.key === key);

      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.key === key
              ? { ...i, quantity: i.quantity + quantity }
              : i
          ),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            key,
            id: product.id,
            name: product.name,
            type: product.type,
            price: product.price,
            image: product.images?.[0],
            size: size || null,
            quantity,
          },
        ],
      };
    }

    case "UPDATE_QUANTITY": {
      const { key, quantity } = action.payload;
      if (quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.key !== key) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.key === key ? { ...i, quantity } : i
        ),
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.key !== action.payload.key),
      };

    case "CLEAR_CART":
      return { ...state, items: [] };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn("Could not persist cart to localStorage:", err);
    }
  }, [state]);

  const addToCart = (product, { size, quantity = 1 } = {}) =>
    dispatch({ type: "ADD_ITEM", payload: { product, size, quantity } });

  const updateQuantity = (key, quantity) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { key, quantity } });

  const removeFromCart = (key) =>
    dispatch({ type: "REMOVE_ITEM", payload: { key } });

  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const itemCount = useMemo(
    () => state.items.reduce((sum, i) => sum + i.quantity, 0),
    [state.items]
  );

  const subtotal = useMemo(
    () => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [state.items]
  );

  const value = {
    items: state.items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    itemCount,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
