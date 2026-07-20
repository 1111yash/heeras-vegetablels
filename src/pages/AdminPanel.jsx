
import { useState, useEffect } from "react";

import {
  ref,
  onValue,
  update,
  remove,
  get,
  set,
  push,
  child,
} from "firebase/database";
import { db } from "../src/firebase";

function AdminPanel() {

  const [editingId, setEditingId] = useState(null);


  const [editProduct, setEditProduct] = useState({
    name: "",
    category: "",
    image: "",
    unitType: "weight",
  });

  const [orders, setOrders] = useState({});
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("orders");

  const [products, setProducts] = useState({});

  const [productName, setProductName] = useState("");


  const [productPrice, setProductPrice] = useState("");

  const [productCategory, setProductCategory] = useState("Vegetables");

  const [productImage, setProductImage] = useState("");

  const [unitType, setUnitType] = useState("weight");

  const [inStock, setInStock] = useState(true);

  const [shopOpen, setShopOpen] = useState(true);



  useEffect(() => {
    const ordersRef = ref(db, "orders");

    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val() || {};
      setOrders(data);
    });
  }, []);

  const updateStatus = (orderId, status) => {
    const data = {
      status: Number(status),
    };

    // 🚚 Jab Out For Delivery ho tab hi timer start hoga
    if (Number(status) === 3) {
      data.outForDeliveryAt = Date.now();
      data.estimatedDelivery = Date.now() + 20 * 60 * 1000; // 20 min
    }

    // 🎉 Delivered hone par actual delivery time save
    if (Number(status) === 4) {
      data.deliveredAt = Date.now();
    }

    update(ref(db, `orders/${orderId}`), data);
  };
  const verifyPayment = (orderId) => {
    update(ref(db, `orders/${orderId}`), {
      paymentStatus: "Verified",
    });
  };
  useEffect(() => {

    const productRef = ref(db, "products");

    onValue(productRef, (snapshot) => {

      setProducts(snapshot.val() || {});

    });

  }, []);

  useEffect(() => {
    const shopRef = ref(db, "shopSettings/isOpen");

    return onValue(shopRef, (snapshot) => {
      setShopOpen(snapshot.val() ?? true);
    });
  }, []);

  const toggleShop = async () => {
    await set(ref(db, "shopSettings/isOpen"), !shopOpen);
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
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await remove(ref(db, `products/${id}`));

    alert("Product Deleted");
  };

  const toggleStock = async (id, currentStock) => {
    await update(ref(db, `products/${id}`), {
      inStock: !currentStock,
    });
  };

  const changePrice = async (id, currentPrice) => {
    const newPrice = prompt("Enter New Price", currentPrice);

    if (!newPrice) return;

    await update(ref(db, `products/${id}`), {
      price: Number(newPrice),
    });

    alert("Price Updated");
  };

  const startEdit = (id, product) => {
    setEditingId(id);

    setEditProduct({
      name: product.name,
      category: product.category,
      image: product.image,
      price: product.price,
      unitType: product.unitType,
      inStock: product.inStock,
    });
  };
  const saveEdit = async () => {
    await update(ref(db, `products/${editingId}`), {
      name: editProduct.name,
      category: editProduct.category,
      image: editProduct.image,
      price: Number(editProduct.price),
      unitType: editProduct.unitType,
      inStock: editProduct.inStock,
    });

    alert("✅ Product Updated");

    setEditingId(null);

    setEditProduct({
      name: "",
      category: "",
      image: "",
      price: "",
      unitType: "weight",
      inStock: true,
    });
  };

  const addProduct = async () => {
    if (!productName || !productPrice || !productImage) {
      alert("Fill all fields");
      return;
    }

    const newProduct = {
      name: productName,
      price: Number(productPrice),
      image: productImage,
      category: productCategory,
      unitType: unitType,
      inStock: inStock,
    };

    const newRef = push(ref(db, "products"));

    await set(newRef, newProduct);

    alert("✅ Product Added Successfully");

    // Reset Form
    setProductName("");
    setProductPrice("");
    setProductCategory("Vegetables");
    setProductImage("");
    setUnitType("weight");
    setInStock(true);
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
    <div className="min-h-screen bg-gray-100 p-6" >

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

          <button
            onClick={toggleShop}
            className={`px-5 py-3 rounded-xl font-bold text-white ${shopOpen
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
              }`}
          >
            {shopOpen ? "🔴 Close Shop" : "🟢 Open Shop"}
          </button>

        </div>

        <div className="flex gap-4 mb-6">

          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-3 rounded-xl font-bold ${activeTab === "orders"
              ? "bg-green-600 text-white"
              : "bg-white"
              }`}
          >

            📦 Orders
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`px-6 py-3 rounded-xl font-bold ${activeTab === "products"
              ? "bg-green-600 text-white"
              : "bg-white"
              }`}
          >

            🥬 Products
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
      {activeTab === "products" && (

        <div className="space-y-6">



          {/* Add Product */}

          <div className="bg-white rounded-3xl shadow-xl p-6">

            <h2 className="text-3xl font-bold text-green-700 mb-6">
              ➕ Add Product
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <input
                placeholder="Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="border rounded-xl p-3"
              />

              <input
                placeholder="Category"
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="border rounded-xl p-3"
              />

              <input
                placeholder="Price"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                className="border rounded-xl p-3"
              />

              <input
                placeholder="Image URL"
                value={productImage}
                onChange={(e) => setProductImage(e.target.value)}
                className="border rounded-xl p-3"
              />

              <select
                value={unitType}
                onChange={(e) => setUnitType(e.target.value)}
                className="border rounded-xl p-3"
              >
                <option value="weight">Weight</option>
                <option value="pieces">Pieces</option>
                <option value="liquid">Liquid</option>
                <option value="juice">Juices</option>

              </select>

              <button
                onClick={addProduct}
                className="bg-green-600 text-white rounded-xl font-bold"
              >
                Save Product
              </button>

            </div>

          </div>

          {/* Product List */}

          <div className="grid md:grid-cols-3 gap-6">

            {Object.entries(products).map(([id, product]) => (

              <div
                key={id}
                className="bg-white rounded-3xl shadow-xl p-5"
              >


                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-xl"
                />

                <h3 className="text-xl font-bold mt-4">
                  {product.name}
                </h3>

                <p className="text-gray-500">
                  {product.category}
                </p>

                <p className="text-green-700 text-2xl font-bold mt-2">
                  ₹{product.price}
                </p>

                <div className="mt-4">

                  <div className="mt-6 space-y-3">

                    <button
                      onClick={() => changePrice(id, product.price)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-bold"
                    >


                      💰 Change Price
                    </button>

                    <button
                      onClick={() => startEdit(id, product)}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-xl font-bold"
                    >
                      ✏️ Edit Product
                    </button>

                    <button
                      onClick={() => toggleStock(id, product.inStock)}
                      className={`w-full py-2 rounded-xl font-bold text-white ${product.inStock
                        ? "bg-orange-500 hover:bg-orange-600"
                        : "bg-green-600 hover:bg-green-700"
                        }`}
                    >
                      {product.inStock ? "🔴 Out Of Stock" : "🟢 In Stock"}
                    </button>



                    <button
                      onClick={() => deleteProduct(id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-bold"
                    >
                      🗑 Delete Product
                    </button>

                    {editingId === id && (

                      <div className="mt-6 border-t pt-4 space-y-3">

                        <input
                          value={editProduct.name}
                          onChange={(e) =>
                            setEditProduct({
                              ...editProduct,
                              name: e.target.value,
                            })
                          }
                          placeholder="Product Name"
                          className="border rounded-xl p-3 w-full"
                        />

                        <input
                          value={editProduct.category}
                          onChange={(e) =>
                            setEditProduct({
                              ...editProduct,
                              category: e.target.value,
                            })
                          }
                          placeholder="Category"
                          className="border rounded-xl p-3 w-full"
                        />

                        <input
                          type="number"
                          value={editProduct.price}
                          onChange={(e) =>
                            setEditProduct({
                              ...editProduct,
                              price: e.target.value,
                            })
                          }
                          placeholder="Price"
                          className="border rounded-xl p-3 w-full"
                        />

                        <input
                          value={editProduct.image}
                          onChange={(e) =>
                            setEditProduct({
                              ...editProduct,
                              image: e.target.value,
                            })
                          }
                          placeholder="Image URL"
                          className="border rounded-xl p-3 w-full"
                        />

                        <select
                          value={editProduct.unitType}
                          onChange={(e) =>
                            setEditProduct({
                              ...editProduct,
                              unitType: e.target.value,
                            })
                          }
                          className="border rounded-xl p-3 w-full"
                        >
                          <option value="weight">Weight</option>
                          <option value="pieces">Pieces</option>
                          <option value="liquid">Liquid</option>
                          <option value="juice">Juices</option>

                        </select>

                        <select
                          value={editProduct.inStock ? "true" : "false"}
                          onChange={(e) =>
                            setEditProduct({
                              ...editProduct,
                              inStock: e.target.value === "true",
                            })
                          }
                          className="border rounded-xl p-3 w-full"
                        >
                          <option value="true">🟢 In Stock</option>
                          <option value="false">🔴 Out Of Stock</option>
                        </select>

                        <button
                          onClick={saveEdit}
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold"
                        >

                          💾 Save Changes
                        </button>

                        <button
                          onClick={() => setEditingId(null)}
                          className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-bold"
                        >
                          ❌ Cancel
                        </button>

                      </div>

                    )}


                  </div>

                  {product.inStock ? (

                    <span className="bg-green-100 text-green-700 px-3 py-2 rounded-full">
                      In Stock
                    </span>

                  ) : (

                    <span className="bg-red-100 text-red-700 px-3 py-2 rounded-full">
                      Out Of Stock
                    </span>

                  )}

                </div>

              </div>

            ))}


          </div>

        </div>

      )}
      {activeTab === "orders" && (

        <div className="space-y-6">

          {filteredOrders.length === 0 ? (

            <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-500 text-xl">
              No Orders Found
            </div>

          ) : (

          filteredOrders.map(([id, order]) => {
  console.log(order);

  return (

              <div
                key={id}
                className={`bg-white rounded-3xl shadow-xl border-l-8 p-6 ${order.status === 0
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

                  
                  

                    {order.latitude && order.longitude && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${order.latitude},${order.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                      >
                        🚚 Navigate to Customer
                      </a>
                    )}

                    {order.location && (
                      <>
                        <p className="mt-2">
                          <strong>📍 GPS Location:</strong>
                        </p>

                        <a
                          href={`https://www.google.com/maps?q=${order.location.latitude},${order.location.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 bg-green-600 text-white px-3 py-2 rounded-lg"
                        >
                          🗺️ Open in Google Maps
                        </a>
                      </>
                    )}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">

                    <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
                      💳 {order.paymentMethod?.toUpperCase()}
                    </span>

                    <span
                      className={`px-4 py-2 rounded-full font-bold ${order.paymentStatus === "Verified"
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

           );
})

          )}

        </div>

      )}
    </div>

  );

}

export default AdminPanel;














