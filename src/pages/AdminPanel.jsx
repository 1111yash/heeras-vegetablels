
import { useState, useEffect } from "react";
import {
  ref,
  onValue,
  update,
  remove,
  get,
  set,
} from "firebase/database";
import { db } from "../src/firebase";

function AdminPanel() {
  const [orders, setOrders] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    const ordersRef = ref(db, "orders");

    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val() || {};
      setOrders(data);
    });
  }, []);

  const updateStatus = (orderId, status) => {
    update(ref(db, `orders/${orderId}`), {
      status: Number(status),
    });
  };

  const verifyPayment = (orderId) => {
    update(ref(db, `orders/${orderId}`), {
      paymentStatus: "Verified",
    });
  };

  const cancelOrder = (orderId) => {
    if (!window.confirm("Cancel this order?")) return;

    update(ref(db, `orders/${orderId}`), {
      status: 0,
      cancelledBy: "Store",
      cancelReason: "Out of Stock",
      refundStatus: "Refund will be processed within 1 hour",
    });
  };

  const archiveOrders = async () => {
    if (!window.confirm("Archive today's orders?")) return;

    const snapshot = await get(ref(db, "orders"));

    if (snapshot.exists()) {
      await set(
        ref(db, `history/${new Date().toLocaleDateString("en-IN")}`),
        snapshot.val()
      );

      await remove(ref(db, "orders"));

      alert("Orders Archived");
    }
  };

  const allOrders = Object.entries(orders);

  const filteredOrders = allOrders
    .filter(([id, order]) => {
      if (!search) return true;

      return (
        id.toLowerCase().includes(search.toLowerCase()) ||
        order.customerName
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        order.phone?.includes(search)
      );
    })
    .sort(
      (a, b) =>
        (b[1].timestamp || 0) -
        (a[1].timestamp || 0)
    );

  const totalSales = filteredOrders.reduce((sum, [, order]) => {
    if (order.status !== 0) {
      return sum + (order.grandTotal || order.total || 0);
    }
    return sum;
  }, 0);

  const pending = filteredOrders.filter(
    ([, o]) => o.status === 1
  ).length;

  const packing = filteredOrders.filter(
    ([, o]) => o.status === 2
  ).length;

  const outForDelivery = filteredOrders.filter(
    ([, o]) => o.status === 3
  ).length;

  const delivered = filteredOrders.filter(
    ([, o]) => o.status === 4
  ).length;

  const cancelled = filteredOrders.filter(
    ([, o]) => o.status === 0
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-4xl font-bold text-green-700">
              🛒 Heera Admin Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              Live Orders Management
            </p>

          </div>

          <button
            onClick={archiveOrders}
            className="bg-red-600 text-white px-5 py-3 rounded-xl font-bold"
          >
            Archive Orders
          </button>

        </div>

        <input
          type="text"
          placeholder="Search Order ID / Customer / Phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mt-6 border rounded-xl p-4"
        />

      </div>

      <div className="grid md:grid-cols-5 gap-5 mb-8">

        <div className="bg-white rounded-2xl p-5 shadow">
          <h3 className="text-gray-500">Today's Sales</h3>
          <p className="text-3xl font-bold text-green-700">
            ₹{totalSales}
          </p>
        </div>

        <div className="bg-yellow-100 rounded-2xl p-5">
          <h3>Pending</h3>
          <p className="text-3xl font-bold">{pending}</p>
        </div>

        <div className="bg-blue-100 rounded-2xl p-5">
          <h3>Packing</h3>
          <p className="text-3xl font-bold">{packing}</p>
        </div>

        <div className="bg-purple-100 rounded-2xl p-5">
          <h3>Delivery</h3>
          <p className="text-3xl font-bold">
            {outForDelivery}
          </p>
        </div>

        <div className="bg-green-100 rounded-2xl p-5">
          <h3>Delivered</h3>
          <p className="text-3xl font-bold">
            {delivered}
          </p>
        </div>

      </div>

            <div className="space-y-6">

        {filteredOrders.length === 0 ? (

          <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-500 text-xl">
            No Orders Found
          </div>

        ) : (

          filteredOrders.map(([id, order]) => (

            <div
              key={id}
              className={`bg-white rounded-3xl shadow-xl border-l-8 p-6 ${
                order.status === 0
                  ? "border-red-500"
                  : "border-green-600"
              }`}
            >

              <div className="flex justify-between items-start">

                <div>

                  <div className="flex items-center gap-3">

                    <h2 className="text-2xl font-bold text-green-700">
                      #{id}
                    </h2>

                    {Date.now() - (order.timestamp || 0) < 600000 && (

                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                        NEW
                      </span>

                    )}

                  </div>

                  <p className="text-gray-500 mt-2">
                    📅 {order.date || new Date(order.timestamp).toLocaleDateString()}
                    &nbsp;&nbsp;
                    🕒 {order.time || new Date(order.timestamp).toLocaleTimeString()}
                  </p>

                </div>

                <div>

                  {order.status === 0 ? (

                    <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                      Cancelled
                    </span>

                  ) : (

                    <span className="bg-green-600 text-white px-4 py-2 rounded-full font-bold">
                      Active
                    </span>

                  )}

                </div>

              </div>

              <div className="mt-6 bg-gray-50 rounded-2xl p-5">

                <h3 className="text-xl font-bold mb-4">
                  👤 Customer Details
                </h3>

                <p className="text-lg font-semibold">
                  {order.customerName}
                </p>

                <p className="mt-2">
                  📞 {order.phone}
                </p>

                <p className="mt-2 whitespace-pre-line">
                  📍 {order.address}
                </p>

                <div className="mt-4 flex flex-wrap gap-3">

                  <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
                    💳 {order.paymentMethod?.toUpperCase()}
                  </span>

                  <span
                    className={`px-4 py-2 rounded-full font-bold ${
                      order.paymentStatus === "Verified"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>

                </div>

              </div>

              <div className="mt-6 bg-white border rounded-2xl p-5">

                <h3 className="text-xl font-bold mb-5">
                  🛒 Ordered Items
                </h3>

                {order.items?.map((item, index) => (

                  <div
                    key={index}
                    className="flex items-center justify-between border-b py-4"
                  >

                    <div className="flex items-center gap-4">

                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover border"
                      />

                      <div>

                        <h4 className="font-bold text-lg">
                          {item.name}
                        </h4>

                        <p className="text-gray-500">
                          {item.unitLabel}
                        </p>

                        <p>
                          Qty : {item.quantity}
                        </p>

                      </div>

                    </div>

                    <div className="text-right">

                      <p className="font-bold">
                        ₹{item.price}
                      </p>

                      <p className="text-green-700 font-bold text-lg">
                        ₹{item.price * item.quantity}
                      </p>

                    </div>

                  </div>

                ))}

                              </div>

              {/* Bill Summary */}

              <div className="mt-6 bg-green-50 rounded-2xl border p-5">

                <h3 className="text-xl font-bold mb-5">
                  💰 Bill Summary
                </h3>

                <div className="flex justify-between mb-3">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal || 0}</span>
                </div>

                <div className="flex justify-between mb-3">
                  <span>Delivery Charge</span>
                  <span>
                    {order.deliveryCharge === 0
                      ? "FREE"
                      : `₹${order.deliveryCharge || 30}`}
                  </span>
                </div>

                <div className="flex justify-between mb-3">
                  <span>Platform Fee</span>
                  <span>₹{order.platformFee || 3}</span>
                </div>

                <hr className="my-4" />

                <div className="flex justify-between text-2xl font-bold text-green-700">
                  <span>Grand Total</span>
                  <span>
                    ₹{order.grandTotal || order.total}
                  </span>
                </div>

              </div>

              {/* Action Buttons */}

              <div className="mt-6 flex flex-wrap gap-3 items-center">

                <select
                  value={order.status}
                  onChange={(e) =>
                    updateStatus(id, e.target.value)
                  }
                  className="border rounded-xl px-4 py-3 font-bold"
                >
                  <option value={1}>✅ Confirmed</option>
                  <option value={2}>📦 Packing</option>
                  <option value={3}>🚚 Out For Delivery</option>
                  <option value={4}>🎉 Delivered</option>
                </select>

                {order.paymentMethod === "upi" &&
                  order.paymentStatus !== "Verified" && (

                    <button
                      onClick={() => verifyPayment(id)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-bold"
                    >
                      ✅ Verify Payment
                    </button>

                  )}

                <button
                  onClick={() => cancelOrder(id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-bold"
                >
                  ❌ Cancel Order
                </button>

                <a
                  href={`https://wa.me/91${order.phone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-bold"
                >
                  💬 WhatsApp
                </a>

              </div>

              {order.status === 0 && (

                <div className="mt-5 bg-red-100 border border-red-500 rounded-2xl p-5">

                  <h3 className="text-xl font-bold text-red-700">
                    ❌ Order Cancelled By Store
                  </h3>

                  <p className="mt-3">
                    Reason :
                    <b> {order.cancelReason || "Out of Stock"}</b>
                  </p>

                  {order.paymentMethod === "upi" && (

                    <div className="mt-3 bg-white rounded-xl p-4 border">

                      <p className="font-bold text-green-700">
                        💸 Refund Status
                      </p>

                      <p className="mt-2">
                        {order.refundStatus ||
                          "Refund will be processed within 1 hour"}
                      </p>

                    </div>

                  )}

                </div>

              )}

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default AdminPanel;



































// import { useState, useEffect } from "react";
// import { ref, onValue, update, remove, get, set } from "firebase/database";
// import { db } from "../src/firebase";

// function AdminPanel() {
//   const [orders, setOrders] = useState(null);

//   useEffect(() => {
//   const ordersRef = ref(db, "orders");

//   onValue(ordersRef, (snapshot) => {
//     const data = snapshot.val();

//     console.log("Orders Data:", data); // 👈 Ye line add karo

//     setOrders(data || {});
//   });
// }, []);


//   // useEffect(() => {
//   //   const ordersRef = ref(db, "orders");
//   //   onValue(ordersRef, (snapshot) => {
//   //     const data = snapshot.val();
//   //     setOrders(data || {});
//   //   });
//   // }, []);

//   const updateStatus = (orderId, newStatus) => {
//     update(ref(db, `orders/${orderId}`), { status: Number(newStatus) })
//       .catch((err) => alert("Error: " + err.message));
//   };

//   const verifyPayment = (orderId) => {
//     update(ref(db, `orders/${orderId}`), { paymentStatus: "Verified" })
//       .catch((err) => alert("Error: " + err.message));
//   };

// const cancelOrder = (orderId) => {
//   if (window.confirm("Cancel this order?")) {
//     update(ref(db, `orders/${orderId}`), {
//       status: 0,
//       cancelReason: "Out of Stock"
//     });
//   }
// };

//   const archiveOrders = async () => {
//     if (window.confirm("आज के सभी ऑर्डर्स को 'Archive' करके डैशबोर्ड साफ करें?")) {
//       const ordersRef = ref(db, "orders");
//       const snapshot = await get(ordersRef);
//       if (snapshot.exists()) {
//         const historyRef = ref(db, "history/" + new Date().toDateString());
//         await set(historyRef, snapshot.val());
//         await remove(ordersRef);
//         alert("डैशबोर्ड साफ हो गया!");
//       }
//     }
//   };

//   if (orders === null) return <div className="p-10 text-center text-xl">Loading...</div>;

//   const sortedOrderIds = Object.keys(orders).sort((a, b) => (orders[b].timestamp || 0) - (orders[a].timestamp || 0));
//   const totalSales = Object.values(orders).reduce((sum, order) => sum + (order.status !== 0 ? (order.total || 0) : 0), 0);

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen text-black">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">🏪 Admin Dashboard</h1>
//         <div className="text-lg font-bold text-green-700">Total: ₹{totalSales}</div>
//         <button onClick={archiveOrders} className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">🌙 Archive</button>
//       </div>

//       {Object.keys(orders).length === 0 ? (
//         <div className="p-10 text-center text-gray-500">कोई नया ऑर्डर नहीं है।</div>
//       ) : (
//         <div className="grid gap-6">
//           {sortedOrderIds.map((id) => (
//             <div key={id} className={`bg-white p-6 rounded-2xl shadow-md border-l-8 ${orders[id].status === 0 ? 'border-red-500' : 'border-green-500'}`}>
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h2 className="text-lg font-bold">#{id}</h2>
//                   <p className="font-semibold">{orders[id].customerName} | 📞 {orders[id].phone}</p>
//                   <p className="text-sm text-gray-600">📍 {orders[id].address}</p>
//                   <div className={`mt-2 px-2 py-1 rounded inline-block text-xs font-bold ${orders[id].paymentStatus === "Verified" ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
//                     Payment: {orders[id].paymentStatus || "Cash On Delivery"}
//                   </div>
//                 </div>
//                 <div className={`px-3 py-1 rounded-full font-bold text-xs text-white ${orders[id].status === 0 ? 'bg-red-500' : 'bg-green-600'}`}>
//                   {orders[id].status === 0 ? 'Cancelled' : 'Active'}
//                 </div>
//               </div>
//               {/* Ordered Items */}
// <div className="mt-5 bg-gray-50 rounded-xl p-4 border">
//   <h3 className="font-bold text-lg mb-4">🛒 Ordered Items</h3>

//   {!orders[id].items ? (
//     <p className="text-red-500">No item data found.</p>
//   ) : Array.isArray(orders[id].items) ? (
    
//     orders[id].items.map((item, index) => (
//       <div
//         key={index}
//         className="flex items-center gap-4 border-b py-3 last:border-0"
//       >
//         <img
//           src={item.image}
//           alt={item.name}
//           className="w-16 h-16 rounded-lg object-cover border"
//         />

//         <div className="flex-1">
//           <h4 className="font-bold">{item.name}</h4>
//           <p>{item.unitLabel}</p>
//           <p>Qty: {item.quantity}</p>
//           <p>₹{item.price}</p>
//         </div>

//         <div className="font-bold">
//           ₹{item.price * item.quantity}
//         </div>
//       </div>
//     ))
//   ) : (
//     <p>{orders[id].items}</p>
//   )}
// </div>

//               {/* Status Dropdown */}
//               {orders[id].status !== 0 && (
//                 <div className="flex flex-wrap items-center gap-3 mt-4">
//                   <select 
//                     value={orders[id].status} 
//                     onChange={(e) => updateStatus(id, e.target.value)}
//                     className="border p-2 rounded-lg font-bold bg-gray-100"
//                   >
//                     <option value="1">1 - Confirmed</option>
//                     <option value="2">2 - Packing</option>
//                     <option value="3">3 - Out for Delivery</option>
//                     <option value="4">4 - Delivered</option>
//                   </select>

//                   {orders[id].paymentMethod === "upi" && orders[id].paymentStatus !== "Verified" && (
//                     <button onClick={() => verifyPayment(id)} className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-bold">✅ Verify</button>
//                   )}
                  
//                   <button onClick={() => cancelOrder(id)} className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-bold">Cancel</button>
//                   <a href={`https://wa.me/91${orders[id].phone}`} target="_blank" rel="noreferrer" className="bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-bold">WhatsApp</a>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
    
//   );
// }

// export default AdminPanel;