import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../src/firebase";

function Cart() {
  const {
    cart,
    increaseQty,
    decreaseQty,
    totalPrice,
    deliveryCharge,
    platformFee,
    grandTotal,
  } = useCart();

  const [shopOpen, setShopOpen] = useState(true);

  useEffect(() => {
    const shopRef = ref(db, "shopSettings/isOpen");

    return onValue(shopRef, (snapshot) => {
      setShopOpen(snapshot.val() ?? true);
    });
  }, []);


  return (
    <div className="max-w-5xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        🛒 My Cart
      </h1>

      {cart.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold">
            Your cart is empty 😔
          </h2>

          <Link to="/products">
            <button className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg">
              Continue Shopping
            </button>
          </Link>
        </div>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={`${item.id}-${item.unitLabel}`}
              className="flex items-center justify-between border rounded-xl shadow-sm p-4 mb-4"
            >
              <div className="flex gap-4 items-center">

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                <div>

                  <h2 className="font-bold text-lg">
                    {item.name}
                  </h2>

                  <p className="text-gray-500">
                    {item.unitLabel}
                  </p>

                  <p className="text-green-700 font-bold mt-1">
                    ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-3">

                <button
                  onClick={() =>
                    decreaseQty(item.id, item.unitLabel)
                  }
                  className="bg-red-500 text-white w-9 h-9 rounded-lg"
                >
                  -
                </button>

                <span className="font-bold text-lg">
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    increaseQty(item.id, item.unitLabel)
                  }
                  className="bg-green-600 text-white w-9 h-9 rounded-lg"
                >
                  +
                </button>

              </div>

            </div>
          ))}

          {!shopOpen && (
            <div className="bg-red-100 border border-red-500 text-red-700 p-4 rounded-xl mb-4 text-center font-bold">
              🚫 Shop is temporarily closed. Orders are not being accepted.
            </div>
          )}
          {/* Bill Details */}

          <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border">

            <h2 className="text-2xl font-bold mb-5">
              🧾 Bill Details
            </h2>

            {/* Items Total */}

            <div className="flex justify-between mb-3">
              <span>Items Total</span>
              <span>₹{totalPrice}</span>
            </div>

            {/* Delivery */}

            <div className="flex justify-between items-center mb-3">

              <span>Delivery Fee</span>

              {deliveryCharge === 0 ? (
                <div className="flex items-center gap-2">

                  <span className="line-through text-gray-400">
                    ₹30
                  </span>

                  <span className="text-green-600 font-bold">
                    FREE
                  </span>

                </div>
              ) : (
                <span>₹30</span>
              )}

            </div>

            {/* Platform Fee */}

            <div className="flex justify-between mb-3">

              <span>Platform Fee</span>

              <span>₹{platformFee}</span>

            </div>

            {/* Free Delivery Offer */}

            {deliveryCharge === 0 ? (

              <div className="bg-green-50 border border-green-300 rounded-xl p-4 my-5">

                <h3 className="font-bold text-green-700">
                  🎉 Free Delivery Unlocked
                </h3>

                <p className="text-sm text-green-700 mt-1">
                  You saved ₹30 on Delivery Charges.
                </p>

              </div>

            ) : (

              <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 my-5">

                <div className="flex justify-between mb-2">

                  <span>
                    Add ₹{400 - totalPrice} more for FREE Delivery
                  </span>

                  <span className="font-bold">
                    ₹{totalPrice}/₹400
                  </span>

                </div>

                <div className="w-full bg-gray-200 h-2 rounded-full">

                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min(
                        (totalPrice / 400) * 100,
                        100
                      )}%`,
                    }}
                  ></div>

                </div>

              </div>

            )}

            <hr className="my-5" />

            <div className="flex justify-between text-2xl font-bold">

              <span>To Pay</span>

              <span className="text-green-700">
                ₹{grandTotal}
              </span>

            </div>

            {shopOpen ? (
              <Link to="/checkout">
                <button className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg">
                  Proceed to Payment • ₹{grandTotal}
                </button>
              </Link>
            ) : (
              <button
                disabled
                className="w-full mt-6 bg-gray-400 text-white py-4 rounded-xl font-bold text-lg cursor-not-allowed"
              >
                🚫 Shop Closed
              </button>
            )}

          </div>
        </>
      )}
    </div>
  );
}

export default Cart;