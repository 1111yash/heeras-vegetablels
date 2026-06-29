import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    const exist = cart.find(
      (item) =>
        item.id === product.id &&
        item.unitLabel === product.unitLabel
    );

    if (exist) {
      setCart(
        cart.map((item) =>
          item.id === product.id &&
          item.unitLabel === product.unitLabel
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const increaseQty = (id, unitLabel) => {
    setCart(
      cart.map((item) =>
        item.id === id && item.unitLabel === unitLabel
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id, unitLabel) => {
    setCart(
      cart
        .map((item) =>
          item.id === id && item.unitLabel === unitLabel
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Items Total
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Delivery Charge
  const deliveryCharge = totalPrice >= 400 ? 0 : 30;

  // Platform Fee
  const platformFee = 5;

  // Final Amount
  const grandTotal = totalPrice + deliveryCharge + platformFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        totalPrice,
        deliveryCharge,
        platformFee,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;