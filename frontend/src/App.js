import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [currentView, setCurrentView] = useState("home");
  const [location, setLocation] = useState("Perunkulam");
  const [searchQuery, setSearchQuery] = useState("");

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Cart State
  const [cart, setCart] = useState([]);

  // Checkout Payment & Address State
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD"); // Default COD

  // Orders State (Fetched from Flask Backend)
  const [orders, setOrders] = useState([]);

  // Fetch Orders from Flask API
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.log("Backend not connected or running local state.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Subscriptions State
  const [subscriptions, setSubscriptions] = useState([
    {
      id: "SUB-401",
      item: "A2 Desi Cow Milk",
      qty: "1 Packet (500ml)",
      frequency: "Daily Morning",
      startDate: "2026-10-01",
      status: "Active",
    },
  ]);

  // Form States
  const [subItem, setSubItem] = useState("Farm Fresh Cow Milk");
  const [subQty, setSubQty] = useState("1 Packet (500ml)");
  const [subFreq, setSubFreq] = useState("Daily Morning");
  const [subDate, setSubDate] = useState("2026-10-16");

  // Authentication System
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Auth Inputs
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const products = [
    {
      id: 1,
      name: "Farm Fresh Cow Milk",
      category: "Dairy",
      price: 60,
      unit: "500 ml",
      image: "🥛",
      desc: "Pure pasteurized cow milk delivered straight from local farms.",
    },
    {
      id: 2,
      name: "Buffalo Rich Milk",
      category: "Dairy",
      price: 70,
      unit: "500 ml",
      image: "🫙",
      desc: "Creamy and rich heavy fat milk for tea and coffee lovers.",
    },
    {
      id: 3,
      name: "A2 Desi Cow Milk",
      category: "Dairy",
      price: 90,
      unit: "500 ml",
      image: "🐄",
      desc: "Organic A2 protein milk ideal for kids and health conscious.",
    },
    {
      id: 4,
      name: "Fresh Farm Curd",
      category: "Dairy",
      price: 45,
      unit: "400 g",
      image: "🥣",
      desc: "Thick, set probiotic curd made with pure milk cultures.",
    },
    {
      id: 5,
      name: "Organic Brown Eggs",
      category: "Grocery",
      price: 75,
      unit: "6 Pack",
      image: "🥚",
      desc: "Free-range organic farm eggs loaded with natural protein.",
    },
    {
      id: 6,
      name: "Wild Forest Honey",
      category: "Grocery",
      price: 280,
      unit: "250 g",
      image: "🍯",
      desc: "100% pure raw wild honey harvested from deep dense forests.",
    },
  ];

  // Cart Functions with Strict Login Guard
  const addToCart = (product) => {
    if (!currentUser) {
      showToast("⚠️ Please Login or Sign Up first to add items to cart!");
      setCurrentView("login");
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
    showToast(`Added ${product.name} to cart! 🛒`);
  };

  const decreaseCartQty = (productId) => {
    if (!currentUser) {
      setCurrentView("login");
      return;
    }

    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === productId) {
            return { ...item, qty: item.qty - 1 };
          }
          return item;
        })
        .filter((item) => item.qty > 0);
    });
  };

  const getCartItemQty = (productId) => {
    const item = cart.find((i) => i.id === productId);
    return item ? item.qty : 0;
  };

  const totalCartItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  };

  // Auth Handler
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError("");

    const emailTrim = authEmail.trim().toLowerCase();
    const passTrim = authPassword.trim();

    if (!emailTrim || !passTrim) {
      setAuthError("Please fill in all mandatory fields.");
      return;
    }

    if (isSigningUp) {
      if (!authName.trim()) {
        setAuthError("Please enter your full name.");
        return;
      }
      if (registeredUsers.some((u) => u.email === emailTrim)) {
        setAuthError(
          "This email is already registered! Please click Login below.",
        );
        return;
      }

      const newUser = {
        name: authName.trim(),
        email: emailTrim,
        password: passTrim,
      };
      setRegisteredUsers([...registeredUsers, newUser]);
      setCurrentUser(newUser);

      setAuthName("");
      setAuthEmail("");
      setAuthPassword("");
      showToast(`Welcome to Frequency, ${newUser.name}! 🎉`);
      setCurrentView("home");
    } else {
      const user = registeredUsers.find(
        (u) => u.email === emailTrim && u.password === passTrim,
      );
      if (user) {
        setCurrentUser(user);
        setAuthName("");
        setAuthEmail("");
        setAuthPassword("");
        showToast(`Welcome back, ${user.name}! 👋`);
        setCurrentView("home");
      } else {
        setAuthError(
          "Account not found! Please Sign Up first as a new customer.",
        );
      }
    }
  };

  // Checkout with Payment Method Sending to Flask Backend API
  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!address) {
      showToast("Please enter your delivery address!");
      return;
    }

    const newOrderData = {
      id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
      items: cart.map((i) => `${i.name} (${i.qty}x)`).join(", "),
      total: calculateTotal(),
      address: address,
      payment: paymentMethod,
      status: "Order Placed & Confirmed",
      date:
        "Today, " +
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
    };

    try {
      await fetch("http://127.0.0.1:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrderData),
      });
    } catch (err) {
      console.log("Flask backend sync error, keeping in local state");
    }

    setOrders([newOrderData, ...orders]);
    setCart([]);
    showToast(`Order placed successfully via ${paymentMethod}! 🚀`);
    setCurrentView("orders");
  };

  // Cancel Order API Call
  const cancelOrder = async (orderId) => {
    try {
      await fetch("http://127.0.0.1:5000/api/orders/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId }),
      });
    } catch (err) {
      console.log("Backend cancel sync error");
    }

    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: "Cancelled" } : order,
      ),
    );
    showToast(`Order ${orderId} cancelled successfully.`);
  };

  const handleCreateSubscription = (e) => {
    e.preventDefault();
    if (!currentUser) {
      showToast("⚠️ Please Login first to schedule milk subscription!");
      setCurrentView("login");
      return;
    }

    const newSub = {
      id: "SUB-" + Math.floor(1000 + Math.random() * 9000),
      item: subItem,
      qty: subQty,
      frequency: subFreq,
      startDate: subDate,
      status: "Active",
    };
    setSubscriptions([newSub, ...subscriptions]);
    showToast("Milk subscription scheduled successfully! 🥛");
    setCurrentView("subscriptions");
  };

  const cancelSubscription = (subId) => {
    setSubscriptions(
      subscriptions.map((sub) =>
        sub.id === subId ? { ...sub, status: "Cancelled" } : sub,
      ),
    );
    showToast("Subscription cancelled.");
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div
      style={{
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        color: "#1e293b",
        fontFamily: "sans-serif",
      }}
    >
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            background: "#0056b3",
            color: "#fff",
            padding: "14px 24px",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            zIndex: 9999,
            fontWeight: "700",
            fontSize: "14px",
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* HEADER NAVBAR */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 50px",
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
          <h1
            onClick={() => setCurrentView("home")}
            style={{
              color: "#0056b3",
              fontSize: "28px",
              fontWeight: "900",
              fontStyle: "italic",
              cursor: "pointer",
              margin: 0,
            }}
          >
            Frequency
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#f1f5f9",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              padding: "8px 14px",
              gap: "8px",
            }}
          >
            <span>📍</span>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                fontWeight: "600",
                cursor: "pointer",
                color: "#334155",
                fontSize: "14px",
              }}
            >
              <option value="Perunkulam">Perunkulam</option>
              <option value="Chennai">Chennai</option>
              <option value="Madurai">Madurai</option>
            </select>
          </div>
        </div>

        <nav
          style={{
            display: "flex",
            gap: "22px",
            alignItems: "center",
            fontSize: "15px",
            fontWeight: "600",
          }}
        >
          <button
            onClick={() => setCurrentView("home")}
            style={navLinkStyle(currentView === "home")}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentView("catalog")}
            style={navLinkStyle(currentView === "catalog")}
          >
            Products
          </button>
          <button
            onClick={() => setCurrentView("subscriptionForm")}
            style={{
              ...navLinkStyle(currentView === "subscriptionForm"),
              color: "#0056b3",
            }}
          >
            🥛 Subscribe
          </button>
          <button
            onClick={() => setCurrentView("subscriptions")}
            style={navLinkStyle(currentView === "subscriptions")}
          >
            My Subs
          </button>
          <button
            onClick={() => setCurrentView("orders")}
            style={navLinkStyle(currentView === "orders")}
          >
            Orders
          </button>

          <button
            onClick={() => {
              if (!currentUser) {
                showToast("⚠️ Please Login first to view Cart!");
                setCurrentView("login");
              } else {
                setCurrentView("cart");
              }
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#0056b3",
              color: "#fff",
              border: "none",
              padding: "10px 18px",
              borderRadius: "10px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,86,179,0.2)",
            }}
          >
            <span>🛒</span> Cart ({totalCartItemsCount})
          </button>

          {currentUser ? (
            <button
              onClick={() => setCurrentView("profile")}
              style={{
                background: "#e0f2fe",
                color: "#0369a1",
                border: "1px solid #bae6fd",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              👤 {currentUser.name}
            </button>
          ) : (
            <button
              onClick={() => {
                setIsSigningUp(false);
                setAuthError("");
                setCurrentView("login");
              }}
              style={{
                background: "#10b981",
                color: "#fff",
                border: "none",
                padding: "9px 18px",
                borderRadius: "8px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Login / Sign Up
            </button>
          )}
        </nav>
      </header>

      {/* MAIN CONTAINER */}
      <main
        style={{ padding: "40px 50px", maxWidth: "1280px", margin: "0 auto" }}
      >
        {/* 1. HOME VIEW */}
        {currentView === "home" && (
          <div>
            <div
              style={{
                background:
                  'linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url("https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1400&q=80") center/cover',
                borderRadius: "24px",
                padding: "70px 30px",
                textAlign: "center",
                color: "#fff",
                marginBottom: "45px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              }}
            >
              <h2
                style={{
                  fontSize: "38px",
                  fontWeight: "800",
                  marginBottom: "12px",
                }}
              >
                Fresh Dairy & Essentials at Your Doorstep
              </h2>
              <p
                style={{ fontSize: "17px", marginBottom: "35px", opacity: 0.9 }}
              >
                Pure farm milk and daily organic essentials delivered before
                7:00 AM.
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  maxWidth: "650px",
                  margin: "0 auto",
                  background: "#fff",
                  borderRadius: "14px",
                  padding: "8px",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "15px",
                    fontSize: "18px",
                  }}
                >
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search for milk, curd, eggs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    border: "none",
                    padding: "12px 15px",
                    fontSize: "16px",
                    outline: "none",
                    color: "#1e293b",
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    style={{
                      background: "#e2e8f0",
                      color: "#475569",
                      border: "none",
                      padding: "12px 18px",
                      borderRadius: "10px",
                      fontWeight: "700",
                      cursor: "pointer",
                      marginRight: "8px",
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "25px",
              }}
            >
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: "800",
                  color: "#0f172a",
                }}
              >
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : "Popular Fresh Products"}
              </h3>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "25px",
              }}
            >
              {filteredProducts.map((product) => {
                const qty = getCartItemQty(product.id);
                return (
                  <div
                    key={product.id}
                    style={{
                      background: "#fff",
                      borderRadius: "18px",
                      overflow: "hidden",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        height: "170px",
                        background: "#f8fafc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "64px",
                        position: "relative",
                      }}
                    >
                      {product.image}
                      <span
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          background: "#e0f2fe",
                          color: "#0369a1",
                          padding: "4px 10px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: "700",
                        }}
                      >
                        {product.category}
                      </span>
                    </div>
                    <div
                      style={{
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                      }}
                    >
                      <h4
                        style={{
                          margin: "0 0 6px 0",
                          fontSize: "18px",
                          fontWeight: "700",
                          color: "#0f172a",
                        }}
                      >
                        {product.name}
                      </h4>
                      <p
                        style={{
                          color: "#64748b",
                          fontSize: "13px",
                          marginBottom: "20px",
                          flexGrow: 1,
                          lineHeight: "1.5",
                        }}
                      >
                        {product.desc}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderTop: "1px solid #f1f5f9",
                          paddingTop: "15px",
                        }}
                      >
                        <div>
                          <span
                            style={{
                              fontSize: "18px",
                              fontWeight: "800",
                              color: "#0f172a",
                            }}
                          >
                            ₹{product.price}
                          </span>
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              marginLeft: "4px",
                            }}
                          >
                            / {product.unit}
                          </span>
                        </div>

                        {qty === 0 ? (
                          <button
                            onClick={() => addToCart(product)}
                            style={{
                              background: "#0056b3",
                              color: "#fff",
                              border: "none",
                              padding: "10px 22px",
                              borderRadius: "10px",
                              fontWeight: "700",
                              cursor: "pointer",
                              boxShadow: "0 4px 12px rgba(0,86,179,0.2)",
                            }}
                          >
                            + Add
                          </button>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              background: "#0056b3",
                              borderRadius: "10px",
                              overflow: "hidden",
                            }}
                          >
                            <button
                              onClick={() => decreaseCartQty(product.id)}
                              style={{
                                background: "#004085",
                                color: "#fff",
                                border: "none",
                                padding: "10px 14px",
                                cursor: "pointer",
                                fontWeight: "800",
                              }}
                            >
                              -
                            </button>
                            <span
                              style={{
                                color: "#fff",
                                padding: "0 14px",
                                fontWeight: "800",
                                fontSize: "15px",
                              }}
                            >
                              {qty}
                            </span>
                            <button
                              onClick={() => addToCart(product)}
                              style={{
                                background: "#004085",
                                color: "#fff",
                                border: "none",
                                padding: "10px 14px",
                                cursor: "pointer",
                                fontWeight: "800",
                              }}
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. CATALOG VIEW */}
        {currentView === "catalog" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "30px",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: "28px",
                    fontWeight: "800",
                    margin: "0 0 6px 0",
                    color: "#0f172a",
                  }}
                >
                  All Products
                </h2>
                <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
                  Fresh dairy & daily grocery items.
                </p>
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: "12px 18px",
                  borderRadius: "10px",
                  border: "1px solid #cbd5e1",
                  width: "280px",
                  outline: "none",
                  fontSize: "14px",
                  background: "#fff",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "25px",
              }}
            >
              {filteredProducts.map((product) => {
                const qty = getCartItemQty(product.id);
                return (
                  <div
                    key={product.id}
                    style={{
                      background: "#fff",
                      borderRadius: "18px",
                      overflow: "hidden",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        height: "170px",
                        background: "#f8fafc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "64px",
                      }}
                    >
                      {product.image}
                    </div>
                    <div
                      style={{
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                      }}
                    >
                      <h4
                        style={{
                          margin: "0 0 6px 0",
                          fontSize: "18px",
                          fontWeight: "700",
                          color: "#0f172a",
                        }}
                      >
                        {product.name}
                      </h4>
                      <p
                        style={{
                          color: "#64748b",
                          fontSize: "13px",
                          marginBottom: "20px",
                          flexGrow: 1,
                          lineHeight: "1.5",
                        }}
                      >
                        {product.desc}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderTop: "1px solid #f1f5f9",
                          paddingTop: "15px",
                        }}
                      >
                        <div>
                          <span
                            style={{
                              fontSize: "18px",
                              fontWeight: "800",
                              color: "#0f172a",
                            }}
                          >
                            ₹{product.price}
                          </span>
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              marginLeft: "4px",
                            }}
                          >
                            / {product.unit}
                          </span>
                        </div>

                        {qty === 0 ? (
                          <button
                            onClick={() => addToCart(product)}
                            style={{
                              background: "#0056b3",
                              color: "#fff",
                              border: "none",
                              padding: "10px 22px",
                              borderRadius: "10px",
                              fontWeight: "700",
                              cursor: "pointer",
                            }}
                          >
                            + Add
                          </button>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              background: "#0056b3",
                              borderRadius: "10px",
                              overflow: "hidden",
                            }}
                          >
                            <button
                              onClick={() => decreaseCartQty(product.id)}
                              style={{
                                background: "#004085",
                                color: "#fff",
                                border: "none",
                                padding: "10px 14px",
                                cursor: "pointer",
                                fontWeight: "800",
                              }}
                            >
                              -
                            </button>
                            <span
                              style={{
                                color: "#fff",
                                padding: "0 14px",
                                fontWeight: "800",
                                fontSize: "15px",
                              }}
                            >
                              {qty}
                            </span>
                            <button
                              onClick={() => addToCart(product)}
                              style={{
                                background: "#004085",
                                color: "#fff",
                                border: "none",
                                padding: "10px 14px",
                                cursor: "pointer",
                                fontWeight: "800",
                              }}
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. CART VIEW WITH FULLY INTERACTIVE PAYMENT OPTIONS */}
        {currentView === "cart" && (
          <div
            style={{
              background: "#fff",
              padding: "40px",
              borderRadius: "20px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
              border: "1px solid #e2e8f0",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "800",
                marginBottom: "25px",
                color: "#0f172a",
              }}
            >
              Your Shopping Cart
            </h2>

            {cart.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <p
                  style={{
                    color: "#64748b",
                    fontSize: "16px",
                    marginBottom: "20px",
                  }}
                >
                  Your cart is empty.
                </p>
                <button
                  onClick={() => setCurrentView("catalog")}
                  style={{
                    background: "#0056b3",
                    color: "#fff",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "10px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: "25px" }}>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px 0",
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "18px",
                        }}
                      >
                        <span style={{ fontSize: "36px" }}>{item.image}</span>
                        <div>
                          <h4
                            style={{
                              margin: "0 0 4px 0",
                              fontWeight: "700",
                              fontSize: "16px",
                              color: "#0f172a",
                            }}
                          >
                            {item.name}
                          </h4>
                          <span style={{ color: "#64748b", fontSize: "14px" }}>
                            ₹{item.price} x {item.qty} ={" "}
                            <b>₹{item.price * item.qty}</b>
                          </span>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "15px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            background: "#f1f5f9",
                            borderRadius: "8px",
                            overflow: "hidden",
                            border: "1px solid #cbd5e1",
                          }}
                        >
                          <button
                            onClick={() => decreaseCartQty(item.id)}
                            style={{
                              background: "transparent",
                              border: "none",
                              padding: "6px 12px",
                              cursor: "pointer",
                              fontWeight: "800",
                            }}
                          >
                            -
                          </button>
                          <span
                            style={{ padding: "0 10px", fontWeight: "700" }}
                          >
                            {item.qty}
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            style={{
                              background: "transparent",
                              border: "none",
                              padding: "6px 12px",
                              cursor: "pointer",
                              fontWeight: "800",
                            }}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            setCart(cart.filter((i) => i.id !== item.id))
                          }
                          style={{
                            background: "#fee2e2",
                            color: "#991b1b",
                            border: "none",
                            padding: "8px 14px",
                            borderRadius: "8px",
                            fontWeight: "700",
                            cursor: "pointer",
                            fontSize: "13px",
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "20px",
                    fontWeight: "800",
                    marginBottom: "30px",
                    background: "#f8fafc",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <span>Total Amount:</span>
                  <span style={{ color: "#0056b3" }}>₹{calculateTotal()}</span>
                </div>

                <form onSubmit={handleCheckout}>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      marginBottom: "15px",
                      color: "#0f172a",
                    }}
                  >
                    Delivery Address
                  </h3>
                  <div style={{ marginBottom: "25px" }}>
                    <input
                      type="text"
                      placeholder="Enter street address, door no, area..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 15px",
                        borderRadius: "10px",
                        border: "1px solid #cbd5e1",
                        outline: "none",
                        fontSize: "14px",
                      }}
                      required
                    />
                  </div>

                  {/* INTERACTIVE PAYMENT OPTIONS */}
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      marginBottom: "15px",
                      color: "#0f172a",
                    }}
                  >
                    Select Payment Method
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "15px",
                      marginBottom: "30px",
                    }}
                  >
                    {[
                      {
                        id: "COD",
                        label: "💵 Cash on Delivery",
                        desc: "Pay cash when order arrives",
                      },
                      {
                        id: "UPI",
                        label: "📱 UPI (GPay / PhonePe)",
                        desc: "Instant UPI payment",
                      },
                      {
                        id: "Card",
                        label: "💳 Credit / Debit Card",
                        desc: "Visa, Mastercard, RuPay",
                      },
                      {
                        id: "NetBanking",
                        label: "🏦 Net Banking",
                        desc: "All major Indian banks",
                      },
                    ].map((pay) => (
                      <label
                        key={pay.id}
                        style={{
                          padding: "16px",
                          borderRadius: "12px",
                          border:
                            paymentMethod === pay.id
                              ? "2px solid #0056b3"
                              : "1px solid #cbd5e1",
                          background:
                            paymentMethod === pay.id ? "#f0f7ff" : "#fff",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "12px",
                        }}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={pay.id}
                          checked={paymentMethod === pay.id}
                          onChange={() => setPaymentMethod(pay.id)}
                          style={{ marginTop: "4px", cursor: "pointer" }}
                        />
                        <div>
                          <span
                            style={{
                              fontWeight: "700",
                              fontSize: "15px",
                              display: "block",
                              color: "#0f172a",
                            }}
                          >
                            {pay.label}
                          </span>
                          <span style={{ fontSize: "12px", color: "#64748b" }}>
                            {pay.desc}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>

                  <button
                    type="submit"
                    style={{
                      background: "#0056b3",
                      color: "#fff",
                      border: "none",
                      width: "100%",
                      padding: "16px",
                      borderRadius: "12px",
                      fontWeight: "800",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  >
                    Place Order (₹{calculateTotal()}) • Mode: {paymentMethod}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* 4. SUBSCRIPTION FORM */}
        {currentView === "subscriptionForm" && (
          <div
            style={{
              background: "#fff",
              padding: "40px",
              borderRadius: "20px",
              maxWidth: "650px",
              margin: "0 auto",
              boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              <span style={{ fontSize: "42px" }}>🥛</span>
              <h2
                style={{
                  fontSize: "26px",
                  fontWeight: "800",
                  color: "#0f172a",
                  margin: "10px 0 6px 0",
                }}
              >
                Schedule Milk Subscription
              </h2>
              <p style={{ color: "#64748b", fontSize: "14px" }}>
                Automated fresh daily deliveries at your door.
              </p>
            </div>

            <form onSubmit={handleCreateSubscription}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  Milk Product
                </label>
                <select
                  value={subItem}
                  onChange={(e) => setSubItem(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    background: "#fff",
                  }}
                >
                  <option value="Farm Fresh Cow Milk">
                    Farm Fresh Cow Milk (₹60 / 500ml)
                  </option>
                  <option value="Buffalo Rich Milk">
                    Buffalo Rich Milk (₹70 / 500ml)
                  </option>
                  <option value="A2 Desi Cow Milk">
                    A2 Desi Cow Milk (₹90 / 500ml)
                  </option>
                </select>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  Quantity
                </label>
                <select
                  value={subQty}
                  onChange={(e) => setSubQty(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    background: "#fff",
                  }}
                >
                  <option value="1 Packet (500ml)">1 Packet (500ml)</option>
                  <option value="2 Packets (1 Litre)">
                    2 Packets (1 Litre)
                  </option>
                </select>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  Frequency
                </label>
                <select
                  value={subFreq}
                  onChange={(e) => setSubFreq(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    background: "#fff",
                  }}
                >
                  <option value="Daily Morning">
                    Daily Morning (Everyday before 7 AM)
                  </option>
                  <option value="Alternate Days">Alternate Days</option>
                </select>
              </div>

              <div style={{ marginBottom: "30px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  Start Date
                </label>
                <input
                  type="date"
                  value={subDate}
                  onChange={(e) => setSubDate(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                style={{
                  background: "#0056b3",
                  color: "#fff",
                  border: "none",
                  width: "100%",
                  padding: "16px",
                  borderRadius: "12px",
                  fontWeight: "800",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Confirm Subscription
              </button>
            </form>
          </div>
        )}

        {/* 5. ACTIVE SUBSCRIPTIONS */}
        {currentView === "subscriptions" && (
          <div>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "800",
                marginBottom: "25px",
                color: "#0f172a",
              }}
            >
              Active Subscriptions
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "20px",
              }}
            >
              {subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  style={{
                    background: "#fff",
                    padding: "24px",
                    borderRadius: "16px",
                    borderLeft: `6px solid ${sub.status === "Active" ? "#10b981" : "#94a3b8"}`,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                    borderTop: "1px solid #e2e8f0",
                    borderRight: "1px solid #e2e8f0",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "12px",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "800",
                        color: "#0056b3",
                        fontSize: "15px",
                      }}
                    >
                      {sub.id}
                    </span>
                    <span
                      style={{
                        background:
                          sub.status === "Active" ? "#d1fae5" : "#f1f5f9",
                        color: sub.status === "Active" ? "#065f46" : "#64748b",
                        padding: "4px 10px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: "700",
                      }}
                    >
                      {sub.status}
                    </span>
                  </div>
                  <h3
                    style={{
                      margin: "0 0 10px 0",
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#0f172a",
                    }}
                  >
                    {sub.item}
                  </h3>
                  <p
                    style={{
                      margin: "6px 0",
                      color: "#475569",
                      fontSize: "14px",
                    }}
                  >
                    Quantity: <b>{sub.qty}</b>
                  </p>
                  <p
                    style={{
                      margin: "6px 0",
                      color: "#475569",
                      fontSize: "14px",
                    }}
                  >
                    Frequency: <b>{sub.frequency}</b>
                  </p>
                  <p
                    style={{
                      margin: "6px 0 20px 0",
                      color: "#475569",
                      fontSize: "14px",
                    }}
                  >
                    Start Date: <b>{sub.startDate}</b>
                  </p>

                  {sub.status === "Active" && (
                    <button
                      onClick={() => cancelSubscription(sub.id)}
                      style={{
                        background: "#fee2e2",
                        color: "#991b1b",
                        border: "none",
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        fontWeight: "700",
                        cursor: "pointer",
                        fontSize: "13px",
                      }}
                    >
                      Cancel Subscription
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. ORDERS VIEW */}
        {currentView === "orders" && (
          <div>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "800",
                marginBottom: "25px",
                color: "#0f172a",
              }}
            >
              My Orders & Tracking
            </h2>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {orders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    background: "#fff",
                    padding: "24px",
                    borderRadius: "18px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontWeight: "800",
                          fontSize: "16px",
                          color: "#0056b3",
                        }}
                      >
                        {order.id}
                      </span>
                      <p
                        style={{
                          margin: "4px 0 0 0",
                          color: "#64748b",
                          fontSize: "13px",
                        }}
                      >
                        Placed on {order.date} • Payment:{" "}
                        <b>{order.payment || "COD"}</b>
                      </p>
                      <p
                        style={{
                          margin: "8px 0 0 0",
                          color: "#1e293b",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        Items: {order.items}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span
                        style={{
                          fontSize: "20px",
                          fontWeight: "800",
                          color: "#0f172a",
                        }}
                      >
                        ₹{order.total}
                      </span>
                      <p
                        style={{
                          margin: "6px 0 0 0",
                          color:
                            order.status === "Cancelled"
                              ? "#c62828"
                              : "#10b981",
                          fontWeight: "700",
                          fontSize: "14px",
                        }}
                      >
                        Status: {order.status}
                      </p>
                    </div>
                  </div>

                  {order.status !== "Cancelled" ? (
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          position: "relative",
                          marginTop: "20px",
                          marginBottom: "20px",
                          padding: "0 20px",
                        }}
                      >
                        <div style={{ textAlign: "center" }}>
                          <div
                            style={{
                              width: "30px",
                              height: "30px",
                              borderRadius: "50%",
                              background: "#10b981",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              margin: "0 auto 6px auto",
                              fontSize: "12px",
                              fontWeight: "800",
                            }}
                          >
                            ✓
                          </div>
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: "700",
                              color: "#0f172a",
                            }}
                          >
                            Placed
                          </span>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div
                            style={{
                              width: "30px",
                              height: "30px",
                              borderRadius: "50%",
                              background: "#10b981",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              margin: "0 auto 6px auto",
                              fontSize: "12px",
                              fontWeight: "800",
                            }}
                          >
                            ✓
                          </div>
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: "700",
                              color: "#0f172a",
                            }}
                          >
                            Confirmed
                          </span>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div
                            style={{
                              width: "30px",
                              height: "30px",
                              borderRadius: "50%",
                              background: "#0056b3",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              margin: "0 auto 6px auto",
                              fontSize: "12px",
                              fontWeight: "800",
                            }}
                          >
                            🚚
                          </div>
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: "700",
                              color: "#0056b3",
                            }}
                          >
                            Out for Delivery
                          </span>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div
                            style={{
                              width: "30px",
                              height: "30px",
                              borderRadius: "50%",
                              background: "#e2e8f0",
                              color: "#94a3b8",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              margin: "0 auto 6px auto",
                              fontSize: "12px",
                              fontWeight: "800",
                            }}
                          >
                            🏠
                          </div>
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#94a3b8",
                              fontWeight: "600",
                            }}
                          >
                            Delivered
                          </span>
                        </div>
                      </div>

                      <div
                        style={{
                          borderTop: "1px solid #f1f5f9",
                          paddingTop: "15px",
                          textAlign: "right",
                        }}
                      >
                        <button
                          onClick={() => cancelOrder(order.id)}
                          style={{
                            background: "#fee2e2",
                            color: "#991b1b",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "8px",
                            fontWeight: "700",
                            cursor: "pointer",
                            fontSize: "13px",
                          }}
                        >
                          Cancel Order
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        background: "#fef2f2",
                        border: "1px solid #fecaca",
                        padding: "12px",
                        borderRadius: "10px",
                        textAlign: "center",
                        color: "#991b1b",
                        fontWeight: "600",
                        fontSize: "13px",
                        marginTop: "15px",
                      }}
                    >
                      ❌ This order has been cancelled.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. AUTHENTICATION */}
        {currentView === "login" && (
          <div
            style={{
              background: "#fff",
              padding: "40px",
              borderRadius: "20px",
              maxWidth: "440px",
              margin: "30px auto",
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
              border: "1px solid #e2e8f0",
            }}
          >
            <h2
              style={{
                fontSize: "26px",
                fontWeight: "800",
                marginBottom: "8px",
                color: "#0056b3",
                textAlign: "center",
              }}
            >
              {isSigningUp ? "Create Customer Account" : "Customer Login"}
            </h2>
            <p
              style={{
                color: "#64748b",
                textAlign: "center",
                marginBottom: "25px",
                fontSize: "14px",
              }}
            >
              {isSigningUp
                ? "Sign up to order dairy & schedule milk subscriptions."
                : "Please enter your email and password to log in."}
            </p>

            {authError && (
              <div
                style={{
                  backgroundColor: "#fee2e2",
                  color: "#991b1b",
                  padding: "12px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  fontSize: "13px",
                  fontWeight: "600",
                  border: "1px solid #f87171",
                }}
              >
                ⚠️ {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit}>
              {isSigningUp && (
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      outline: "none",
                    }}
                    required
                  />
                </div>
              )}

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    outline: "none",
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    outline: "none",
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                style={{
                  background: "#0056b3",
                  color: "#fff",
                  border: "none",
                  width: "100%",
                  padding: "14px",
                  borderRadius: "8px",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontSize: "15px",
                  marginBottom: "15px",
                }}
              >
                {isSigningUp ? "Create Account" : "Login"}
              </button>
            </form>

            <div
              style={{
                textAlign: "center",
                fontSize: "14px",
                color: "#64748b",
                borderTop: "1px solid #f1f5f9",
                paddingTop: "15px",
              }}
            >
              {isSigningUp ? (
                <p>
                  Already have an account?{" "}
                  <span
                    onClick={() => {
                      setIsSigningUp(false);
                      setAuthError("");
                    }}
                    style={{
                      color: "#0056b3",
                      fontWeight: "700",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    Login here
                  </span>
                </p>
              ) : (
                <p>
                  New customer?{" "}
                  <span
                    onClick={() => {
                      setIsSigningUp(true);
                      setAuthError("");
                    }}
                    style={{
                      color: "#0056b3",
                      fontWeight: "700",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                  >
                    Create new account
                  </span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* 8. PROFILE VIEW */}
        {currentView === "profile" && currentUser && (
          <div
            style={{
              background: "#fff",
              padding: "40px",
              borderRadius: "20px",
              maxWidth: "500px",
              margin: "30px auto",
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
              textAlign: "center",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ fontSize: "64px", marginBottom: "10px" }}>👤</div>
            <h2
              style={{
                fontSize: "26px",
                fontWeight: "800",
                marginBottom: "4px",
                color: "#0f172a",
              }}
            >
              {currentUser.name}
            </h2>
            <p
              style={{
                color: "#64748b",
                marginBottom: "25px",
                fontSize: "14px",
              }}
            >
              {currentUser.email}
            </p>

            <div
              style={{
                background: "#f8fafc",
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "25px",
                textAlign: "left",
                border: "1px solid #e2e8f0",
              }}
            >
              <p style={{ margin: "8px 0", fontSize: "14px" }}>
                📍 <b>Delivery Location:</b> {location}
              </p>
              <p style={{ margin: "8px 0", fontSize: "14px" }}>
                🥛 <b>Active Subscriptions:</b>{" "}
                {subscriptions.filter((s) => s.status === "Active").length}{" "}
                Active
              </p>
              <p style={{ margin: "8px 0", fontSize: "14px" }}>
                📦 <b>Total Orders Placed:</b> {orders.length} Orders
              </p>
            </div>

            <button
              onClick={() => {
                setCurrentUser(null);
                setCurrentView("home");
                showToast("Logged out successfully.");
              }}
              style={{
                background: "#fee2e2",
                color: "#991b1b",
                border: "none",
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                fontWeight: "700",
                cursor: "pointer",
                fontSize: "15px",
              }}
            >
              Logout Account
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

const navLinkStyle = (isActive) => ({
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: isActive ? "800" : "600",
  color: isActive ? "#0056b3" : "#475569",
  padding: "6px 0",
  borderBottom: isActive ? "2px solid #0056b3" : "none",
});

export default App;
