import React, { useState } from "react";

function App() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Location & Search
  const [location, setLocation] = useState("Perunkulam (Current)");
  const [searchTerm, setSearchTerm] = useState("");

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [address, setAddress] = useState("123 Main St, Perunkulam");
  const [view, setView] = useState("shop"); // shop, cart, orders, subscription
  const [message, setMessage] = useState("");

  // Subscription Form States
  const [subItem, setSubItem] = useState("Farm Fresh Milk (1L)");
  const [subQuantity, setSubQuantity] = useState(1);
  const [subFrequency, setSubFrequency] = useState("Daily Delivery");
  const [subStartDate, setSubStartDate] = useState("");

  // Handle Login / Register
  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await fetch(`http://127.0.0.1:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        if (isLogin) {
          setUser(data.user);
          loadProducts();
        } else {
          setMessage("Registered! Please login.");
          setIsLogin(true);
        }
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Backend Connection Error");
    }
  };

  const loadProducts = async () => {
    const res = await fetch("http://127.0.0.1:5000/api/products");
    const data = await res.json();
    setProducts(data);
  };

  const loadCart = async () => {
    if (!user) return;
    const res = await fetch(`http://127.0.0.1:5000/api/cart/${user.id}`);
    const data = await res.json();
    setCart(data);
  };

  const addToCart = async (productId) => {
    await fetch("http://127.0.0.1:5000/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, product_id: productId }),
    });
    alert("Item added to cart!");
  };

  const placeOrder = async () => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const res = await fetch("http://127.0.0.1:5000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, total, address }),
    });
    if (res.ok) {
      alert("Order Placed Successfully!");
      loadCart();
      loadOrders();
      setView("orders");
    }
  };

  const loadOrders = async () => {
    if (!user) return;
    const res = await fetch(`http://127.0.0.1:5000/api/orders/${user.id}`);
    const data = await res.json();
    setOrders(data);
  };

  const startSubscription = async (e) => {
    e.preventDefault();
    if (!subStartDate) {
      alert("Please select a start date!");
      return;
    }

    const formattedItemName = `${subItem} (${subQuantity} Packet${subQuantity > 1 ? "s" : ""})`;

    const res = await fetch("http://127.0.0.1:5000/api/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        item_name: formattedItemName,
        frequency: subFrequency,
        start_date: subStartDate,
      }),
    });
    if (res.ok) {
      alert("Milk Subscription Activated Successfully!");
      loadSubscriptions();
    }
  };

  const loadSubscriptions = async () => {
    if (!user) return;
    const res = await fetch(
      `http://127.0.0.1:5000/api/subscriptions/${user.id}`,
    );
    const data = await res.json();
    setSubscriptions(data);
  };

  // Filter products by Search
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!user) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          fontFamily: "sans-serif",
        }}
      >
        <h2>{isLogin ? "Frequency Login" : "Frequency Sign Up"}</h2>
        <form
          onSubmit={handleAuth}
          style={{ display: "inline-block", width: "250px" }}
        >
          {!isLogin && (
            <div style={{ marginBottom: "10px" }}>
              <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: "100%", padding: "8px" }}
              />
            </div>
          )}
          <div style={{ marginBottom: "10px" }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
          <button
            type="submit"
            style={{ width: "100%", padding: "8px", cursor: "pointer" }}
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <p
          style={{ color: "blue", cursor: "pointer", marginTop: "15px" }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Need an account? Sign Up" : "Have an account? Login"}
        </p>
        {message && <p style={{ color: "red" }}>{message}</p>}
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px solid #eee",
          pb: "10px",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Frequency Store</h1>
          <p style={{ margin: "5px 0" }}>
            Welcome, <b>{user.name}</b>!
          </p>
        </div>

        {/* LOCATION SELECTOR */}
        <div
          style={{
            background: "#e8f5e9",
            padding: "8px 15px",
            borderRadius: "20px",
            border: "1px solid #4caf50",
          }}
        >
          <label
            style={{ marginRight: "8px", fontSize: "14px", fontWeight: "bold" }}
          >
            📍 Location:
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{
              border: "none",
              background: "transparent",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            <option value="Perunkulam (Current)">Perunkulam</option>
            <option value="Chennai">Chennai</option>
            <option value="Madurai">Madurai</option>
            <option value="Coimbatore">Coimbatore</option>
          </select>
        </div>
      </div>

      <nav
        style={{
          margin: "20px 0",
          padding: "10px",
          background: "#f4f4f4",
          borderRadius: "5px",
        }}
      >
        <button
          onClick={() => setView("shop")}
          style={{
            marginRight: "10px",
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          Products
        </button>
        <button
          onClick={() => {
            loadCart();
            setView("cart");
          }}
          style={{
            marginRight: "10px",
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          Cart ({cart.length})
        </button>
        <button
          onClick={() => {
            loadOrders();
            setView("orders");
          }}
          style={{
            marginRight: "10px",
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          My Orders
        </button>
        <button
          onClick={() => {
            loadSubscriptions();
            setView("subscription");
          }}
          style={{
            padding: "8px 12px",
            cursor: "pointer",
            backgroundColor: "#e3f2fd",
          }}
        >
          Milk Subscription
        </button>
      </nav>

      {/* PRODUCTS VIEW WITH SEARCH */}
      {view === "shop" && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <h2>Available Products</h2>
            <input
              type="text"
              placeholder="🔍 Search milk, curd, eggs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "8px 15px",
                width: "250px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                style={{
                  border: "1px solid #ccc",
                  padding: "15px",
                  borderRadius: "8px",
                  width: "180px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "40px" }}>{p.image}</div>
                <h3>{p.name}</h3>
                <p>Category: {p.category}</p>
                <p>Price: ₹{p.price}</p>
                <button
                  onClick={() => addToCart(p.id)}
                  style={{ padding: "6px 12px", cursor: "pointer" }}
                >
                  Add to Cart
                </button>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <p>No products found matching "{searchTerm}"</p>
            )}
          </div>
        </div>
      )}

      {/* CART VIEW */}
      {view === "cart" && (
        <div>
          <h2>Your Cart</h2>
          {cart.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            <>
              {cart.map((item, idx) => (
                <div
                  key={idx}
                  style={{ borderBottom: "1px solid #ddd", padding: "10px" }}
                >
                  <b>{item.name}</b> - ₹{item.price}
                </div>
              ))}
              <h3>Total: ₹{cart.reduce((sum, item) => sum + item.price, 0)}</h3>
              <div style={{ marginBottom: "15px" }}>
                <label>
                  <b>Delivery Address:</b>{" "}
                </label>
                <br />
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ width: "300px", padding: "8px", marginTop: "5px" }}
                />
              </div>
              <button
                onClick={placeOrder}
                style={{
                  padding: "10px 20px",
                  background: "green",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Place Order
              </button>
            </>
          )}
        </div>
      )}

      {/* ORDERS VIEW WITH STATUS TRACKING */}
      {view === "orders" && (
        <div>
          <h2>My Order History & Real-Time Tracking</h2>
          {orders.length === 0 ? (
            <p>No orders placed yet.</p>
          ) : (
            orders.map((o) => (
              <div
                key={o.id}
                style={{
                  border: "1px solid #4CAF50",
                  padding: "15px",
                  marginBottom: "15px",
                  borderRadius: "8px",
                  background: "#f9f9f9",
                }}
              >
                <p style={{ margin: "3px 0" }}>
                  <b>Order ID:</b> #{o.id}
                </p>
                <p style={{ margin: "3px 0" }}>
                  <b>Total Amount:</b> ₹{o.total_amount}
                </p>
                <p style={{ margin: "3px 0" }}>
                  <b>Address:</b> {o.address}
                </p>

                {/* STATUS FLOW BADGE */}
                <div
                  style={{
                    marginTop: "10px",
                    padding: "10px",
                    background: "#e8f5e9",
                    borderRadius: "5px",
                  }}
                >
                  <small style={{ color: "#555" }}>Order Status Flow:</small>
                  <br />
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    ✓ Placed
                  </span>{" "}
                  ➔
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    {" "}
                    ✓ Confirmed
                  </span>{" "}
                  ➔
                  <span style={{ color: "orange", fontWeight: "bold" }}>
                    {" "}
                    🚚 Out for Delivery
                  </span>{" "}
                  ➔<span style={{ color: "#888" }}> Delivered</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SUBSCRIPTION VIEW */}
      {view === "subscription" && (
        <div>
          <h2>Recurring Milk Subscription Setup</h2>
          <form
            onSubmit={startSubscription}
            style={{
              border: "1px solid #2196F3",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "420px",
              background: "#f0f8ff",
            }}
          >
            <div style={{ marginBottom: "15px" }}>
              <label>
                <b>Select Milk Type:</b>
              </label>
              <br />
              <select
                value={subItem}
                onChange={(e) => setSubItem(e.target.value)}
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              >
                <option value="Farm Fresh Milk (1L)">
                  Farm Fresh Milk (1L)
                </option>
                <option value="Organic Buffalo Milk (1L)">
                  Organic Buffalo Milk (1L)
                </option>
                <option value="A2 Cow Milk (1L)">A2 Cow Milk (1L)</option>
              </select>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label>
                <b>Quantity (Packets per day):</b>
              </label>
              <br />
              <input
                type="number"
                min="1"
                max="10"
                value={subQuantity}
                onChange={(e) => setSubQuantity(e.target.value)}
                style={{ width: "95%", padding: "8px", marginTop: "5px" }}
                required
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label>
                <b>Delivery Frequency:</b>
              </label>
              <br />
              <select
                value={subFrequency}
                onChange={(e) => setSubFrequency(e.target.value)}
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              >
                <option value="Daily Delivery">Daily Delivery</option>
                <option value="Alternate Days (Every 2nd Day)">
                  Alternate Days (Every 2nd Day)
                </option>
                <option value="Weekly (Every Monday)">
                  Weekly (Every Monday)
                </option>
              </select>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label>
                <b>Start Date:</b>
              </label>
              <br />
              <input
                type="date"
                value={subStartDate}
                onChange={(e) => setSubStartDate(e.target.value)}
                style={{ width: "95%", padding: "8px", marginTop: "5px" }}
                required
              />
            </div>

            <button
              type="submit"
              style={{
                padding: "10px 20px",
                background: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Subscribe Now
            </button>
          </form>

          <h3 style={{ marginTop: "30px" }}>Active Subscriptions</h3>
          {subscriptions.length === 0 ? (
            <p>No active subscriptions.</p>
          ) : (
            subscriptions.map((s) => (
              <div
                key={s.id}
                style={{
                  border: "1px solid #2196F3",
                  padding: "12px",
                  marginBottom: "8px",
                  borderRadius: "6px",
                  background: "#ffffff",
                  maxWidth: "420px",
                }}
              >
                <p style={{ margin: "3px 0" }}>
                  <b>Item:</b> {s.item_name}
                </p>
                <p style={{ margin: "3px 0" }}>
                  <b>Frequency:</b> {s.frequency}
                </p>
                <p style={{ margin: "3px 0" }}>
                  <b>Start Date:</b> {s.start_date}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default App;
