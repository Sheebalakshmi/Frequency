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
  const [paymentMethod, setPaymentMethod] = useState("COD");

  // Orders State
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
  const [subscriptions, setSubscriptions] = useState([]);

  // Subscription Selection State
  const [selectedPlan, setSelectedPlan] = useState("Daily Regular");
  const [subItem, setSubItem] = useState("A2 Desi Cow Milk");
  const [subQty, setSubQty] = useState("1 Packet (500ml)");
  const [subDate, setSubDate] = useState("2026-10-25");

  // Authentication System
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Auth Inputs
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // TAMIL NADU CITIES LIST
  const tnLocations = [
    "Perunkulam",
    "Chennai",
    "Madurai",
    "Coimbatore",
    "Tirunelveli",
    "Trichy",
    "Salem",
    "Erode",
    "Vellore",
    "Thanjavur",
    "Kanyakumari",
    "Nagercoil",
    "Tuticorin",
    "Dindigul",
    "Theni",
    "Virudhunagar",
    "Karur",
    "Namakkal",
    "Tiruppur",
    "Cuddalore",
    "Kanchipuram",
    "Tiruvallur",
  ];

  // RICH DAIRY CATALOGUE
  const products = [
    {
      id: 1,
      name: "A2 Desi Cow Milk",
      category: "Milk",
      price: 90,
      unit: "500 ml",
      image: "🐄",
      desc: "Organic A2 protein milk rich in nutrients, delivered raw and pure.",
    },
    {
      id: 2,
      name: "Farm Fresh Cow Milk",
      category: "Milk",
      price: 60,
      unit: "500 ml",
      image: "🥛",
      desc: "Pasteurized pure cow milk delivered straight from local ethical farms.",
    },
    {
      id: 3,
      name: "Buffalo Rich Fat Milk",
      category: "Milk",
      price: 70,
      unit: "500 ml",
      image: "🫙",
      desc: "Creamy high-fat buffalo milk for thick tea, coffee, and traditional sweets.",
    },
    {
      id: 4,
      name: "Full Cream Gold Milk",
      category: "Milk",
      price: 65,
      unit: "500 ml",
      image: "✨",
      desc: "Rich standardized full cream milk ideal for everyday family health.",
    },
    {
      id: 5,
      name: "Toned Low Fat Milk",
      category: "Milk",
      price: 50,
      unit: "500 ml",
      image: "🍶",
      desc: "Light, low-fat healthy milk balanced for fitness and easy digestion.",
    },
    {
      id: 6,
      name: "Traditional Thick Curd",
      category: "Dairy & Curd",
      price: 45,
      unit: "400 g",
      image: "🥣",
      desc: "Thick set probiotic curd churned with authentic traditional cultures.",
    },
    {
      id: 7,
      name: "Pure Country Cow Ghee",
      category: "Ghee & Butter",
      price: 450,
      unit: "500 g",
      image: "🏺",
      desc: "Aromatic golden cow ghee prepared using traditional bilona method.",
    },
    {
      id: 8,
      name: "Fresh Farm Malai Paneer",
      category: "Cheese & Paneer",
      price: 120,
      unit: "200 g",
      image: "🧀",
      desc: "Soft, melt-in-mouth cottage cheese crafted fresh every morning.",
    },
    {
      id: 9,
      name: "Unsalted Cultured Butter",
      category: "Ghee & Butter",
      price: 140,
      unit: "200 g",
      image: "🧈",
      desc: "Pure white farm butter churned freshly without artificial salt.",
    },
    {
      id: 10,
      name: "Rich Cooking Malai Cream",
      category: "Dairy & Curd",
      price: 95,
      unit: "200 g",
      image: "🥣",
      desc: "Thick natural fresh cream for gravies, desserts, and bakery recipes.",
    },
    {
      id: 11,
      name: "Chilled Badam Milk Drink",
      category: "Beverages",
      price: 40,
      unit: "200 ml",
      image: "🍾",
      desc: "Refrigerated milk drink infused with real almond bits and saffron.",
    },
    {
      id: 12,
      name: "Spiced Buttermilk (Mor)",
      category: "Beverages",
      price: 25,
      unit: "300 ml",
      image: "🥛",
      desc: "Cooling probiotic buttermilk flavored with curry leaves, ginger & chillies.",
    },
  ];

  // Logout Function with Cart Reset
  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]);
    setCurrentView("home");
    showToast("Logged out successfully.");
  };

  // Cart Functions
  const addToCart = (product) => {
    if (!currentUser) {
      showToast("⚠️ Please Login or Sign Up first to add items!");
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
        setAuthError("This email is already registered! Please Login below.");
        return;
      }

      const newUser = {
        name: authName.trim(),
        email: emailTrim,
        password: passTrim,
      };
      setRegisteredUsers([...registeredUsers, newUser]);
      setCurrentUser(newUser);
      setCart([]);

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
        setCart([]);
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

  // Checkout with Payment Method Sending to Backend
  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!address) {
      showToast("Please enter your delivery address!");
      return;
    }

    const newOrderData = {
      id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
      userEmail: currentUser.email, // Tag order strictly with logged-in user email
      userName: currentUser.name,
      items: cart.map((i) => `${i.name} (${i.qty}x)`).join(", "),
      total: calculateTotal(),
      address: `${address} (${location})`,
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

  // Visual Plan Subscription Handler
  const handleCreateSubscription = (planName) => {
    if (!currentUser) {
      showToast("⚠️ Please Login first to schedule milk subscription!");
      setCurrentView("login");
      return;
    }

    const newSub = {
      id: "SUB-" + Math.floor(1000 + Math.random() * 9000),
      userEmail: currentUser.email, // Tag subscription strictly with logged-in user email
      userName: currentUser.name,
      item: subItem,
      qty: subQty,
      frequency: planName || selectedPlan,
      startDate: subDate,
      status: "Active",
      price: subItem.includes("A2")
        ? "₹90/day"
        : subItem.includes("Buffalo")
          ? "₹70/day"
          : "₹60/day",
    };
    setSubscriptions([newSub, ...subscriptions]);
    showToast(`${planName || selectedPlan} Subscription Scheduled! 🥛`);
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

  // STRICT USER-SPECIFIC DATA FILTER
  const userOrders = currentUser
    ? orders.filter((o) => o.userEmail === currentUser.email)
    : [];

  const userSubscriptions = currentUser
    ? subscriptions.filter((s) => s.userEmail === currentUser.email)
    : [];

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div
      style={{
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        color: "#f8fafc",
        fontFamily: '"Playfair Display", Georgia, serif',
      }}
    >
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            background: "#d97706",
            color: "#fff",
            padding: "14px 28px",
            borderRadius: "8px",
            boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
            zIndex: 9999,
            fontWeight: "700",
            fontSize: "14px",
            letterSpacing: "0.5px",
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* FLAVIO STYLE HEADER NAVBAR */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 50px",
          backgroundColor: "#090d16",
          borderBottom: "1px solid #1e293b",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
          <div
            onClick={() => setCurrentView("home")}
            style={{ cursor: "pointer", textAlign: "left" }}
          >
            <h1
              style={{
                color: "#fbbf24",
                fontSize: "28px",
                fontWeight: "900",
                letterSpacing: "2px",
                margin: 0,
                textTransform: "uppercase",
                fontFamily: "serif",
              }}
            >
              FREQUENCY
            </h1>
            <span
              style={{
                fontSize: "9px",
                color: "#94a3b8",
                letterSpacing: "3px",
                textTransform: "uppercase",
                display: "block",
              }}
            >
              PURE DAIRY & ESSENTIALS
            </span>
          </div>

          {/* LOCATION SELECTOR */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "6px",
              padding: "6px 14px",
              gap: "8px",
            }}
          >
            <span
              style={{ fontSize: "12px", color: "#fbbf24", fontWeight: "700" }}
            >
              📍 LOCATION
            </span>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                fontWeight: "600",
                cursor: "pointer",
                color: "#f8fafc",
                fontSize: "13px",
                fontFamily: "sans-serif",
              }}
            >
              {tnLocations.map((loc) => (
                <option key={loc} value={loc} style={{ background: "#0f172a" }}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        <nav
          style={{
            display: "flex",
            gap: "24px",
            alignItems: "center",
            fontSize: "12px",
            fontWeight: "700",
            letterSpacing: "1px",
            textTransform: "uppercase",
            fontFamily: "sans-serif",
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
            Dairy Catalogue
          </button>
          <button
            onClick={() => setCurrentView("subscriptionForm")}
            style={{
              ...navLinkStyle(currentView === "subscriptionForm"),
              color: "#fbbf24",
            }}
          >
            ✨ Subscribe Milk
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
              background: "#d97706",
              color: "#fff",
              border: "none",
              padding: "9px 18px",
              borderRadius: "4px",
              fontWeight: "800",
              cursor: "pointer",
              letterSpacing: "1px",
              boxShadow: "0 4px 15px rgba(217,119,6,0.3)",
            }}
          >
            CART ({currentUser ? totalCartItemsCount : 0})
          </button>

          {currentUser ? (
            <button
              onClick={() => setCurrentView("profile")}
              style={{
                background: "#1e293b",
                color: "#fbbf24",
                border: "1px solid #fbbf24",
                padding: "8px 16px",
                borderRadius: "4px",
                fontSize: "12px",
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
                padding: "8px 18px",
                borderRadius: "4px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              SIGN IN
            </button>
          )}
        </nav>
      </header>

      {/* MAIN CONTAINER */}
      <main
        style={{ padding: "40px 50px", maxWidth: "1350px", margin: "0 auto" }}
      >
        {/* 1. HOME VIEW */}
        {currentView === "home" && (
          <div>
            <div
              style={{
                background:
                  'linear-gradient(rgba(15,23,42,0.85), rgba(15,23,42,0.85)), url("https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?auto=format&fit=crop&w=1600&q=80") center/cover',
                borderRadius: "12px",
                padding: "80px 30px",
                textAlign: "center",
                color: "#fff",
                marginBottom: "50px",
                border: "1px solid #1e293b",
              }}
            >
              <span
                style={{
                  color: "#fbbf24",
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                  fontSize: "12px",
                  fontWeight: "800",
                  display: "block",
                  marginBottom: "10px",
                  fontFamily: "sans-serif",
                }}
              >
                SERVING ALL ACROSS TAMIL NADU
              </span>
              <h2
                style={{
                  fontSize: "44px",
                  fontWeight: "400",
                  marginBottom: "16px",
                  letterSpacing: "1px",
                }}
              >
                100% Pure Dairy Delivered Before 7 AM
              </h2>
              <p
                style={{
                  fontSize: "15px",
                  marginBottom: "35px",
                  color: "#cbd5e1",
                  maxWidth: "650px",
                  margin: "0 auto 35px auto",
                  fontFamily: "sans-serif",
                  fontWeight: "300",
                  lineHeight: "1.7",
                }}
              >
                Delivering fresh A2 cow milk, thick curd, aromatic ghee, malai
                paneer, and rich butter directly to your doorstep in{" "}
                <b>{location}</b>.
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  maxWidth: "600px",
                  margin: "0 auto",
                  background: "#090d16",
                  borderRadius: "6px",
                  padding: "6px",
                  border: "1px solid #334155",
                }}
              >
                <input
                  type="text"
                  placeholder="Search A2 milk, paneer, ghee, curd, mor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    border: "none",
                    padding: "12px 20px",
                    fontSize: "15px",
                    outline: "none",
                    color: "#f8fafc",
                    background: "transparent",
                    fontFamily: "sans-serif",
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    style={{
                      background: "#334155",
                      color: "#cbd5e1",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontFamily: "sans-serif",
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <span
                style={{
                  color: "#fbbf24",
                  fontSize: "12px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  fontWeight: "800",
                  fontFamily: "sans-serif",
                }}
              >
                FRESH DAIRY SELECTION
              </span>
              <h3
                style={{
                  fontSize: "32px",
                  fontWeight: "400",
                  margin: "8px 0 0 0",
                }}
              >
                {searchQuery
                  ? `Results for "${searchQuery}"`
                  : "Daily Dairy & Milk Items"}
              </h3>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "30px",
              }}
            >
              {filteredProducts.map((product) => {
                const qty = getCartItemQty(product.id);
                return (
                  <div
                    key={product.id}
                    style={{
                      background: "#090d16",
                      borderRadius: "10px",
                      border: "1px solid #1e293b",
                      padding: "25px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        height: "160px",
                        background: "#0f172a",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "64px",
                        marginBottom: "18px",
                        border: "1px solid #1e293b",
                      }}
                    >
                      {product.image}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "8px",
                      }}
                    >
                      <h4
                        style={{
                          margin: 0,
                          fontSize: "20px",
                          fontWeight: "400",
                          color: "#f8fafc",
                        }}
                      >
                        {product.name}
                      </h4>
                      <span
                        style={{
                          color: "#fbbf24",
                          fontSize: "17px",
                          fontWeight: "700",
                          fontFamily: "sans-serif",
                        }}
                      >
                        ₹{product.price}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#d97706",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        fontWeight: "700",
                        marginBottom: "10px",
                        fontFamily: "sans-serif",
                      }}
                    >
                      {product.category} • {product.unit}
                    </span>
                    <p
                      style={{
                        color: "#94a3b8",
                        fontSize: "13px",
                        marginBottom: "20px",
                        lineHeight: "1.5",
                        flexGrow: 1,
                        fontFamily: "sans-serif",
                        fontWeight: "300",
                      }}
                    >
                      {product.desc}
                    </p>

                    <div
                      style={{
                        borderTop: "1px solid #1e293b",
                        paddingTop: "16px",
                      }}
                    >
                      {qty === 0 ? (
                        <button
                          onClick={() => addToCart(product)}
                          style={{
                            background: "#d97706",
                            color: "#fff",
                            border: "none",
                            width: "100%",
                            padding: "11px",
                            borderRadius: "4px",
                            fontWeight: "800",
                            cursor: "pointer",
                            letterSpacing: "1px",
                            fontSize: "12px",
                            fontFamily: "sans-serif",
                          }}
                        >
                          + ADD TO BASKET
                        </button>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            background: "#1e293b",
                            borderRadius: "4px",
                            padding: "4px 10px",
                          }}
                        >
                          <button
                            onClick={() => decreaseCartQty(product.id)}
                            style={{
                              background: "transparent",
                              color: "#fbbf24",
                              border: "none",
                              fontSize: "18px",
                              cursor: "pointer",
                              fontWeight: "800",
                            }}
                          >
                            -
                          </button>
                          <span
                            style={{
                              color: "#fff",
                              fontWeight: "800",
                              fontSize: "14px",
                              fontFamily: "sans-serif",
                            }}
                          >
                            {qty} IN BASKET
                          </span>
                          <button
                            onClick={() => addToCart(product)}
                            style={{
                              background: "transparent",
                              color: "#fbbf24",
                              border: "none",
                              fontSize: "18px",
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
                );
              })}
            </div>
          </div>
        )}

        {/* 2. CATALOG VIEW */}
        {currentView === "catalog" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <span
                style={{
                  color: "#fbbf24",
                  fontSize: "12px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  fontWeight: "800",
                  fontFamily: "sans-serif",
                }}
              >
                COMPLETE CATALOGUE
              </span>
              <h2
                style={{
                  fontSize: "36px",
                  fontWeight: "400",
                  margin: "8px 0 0 0",
                }}
              >
                All Fresh Dairy & Farm Items
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "30px",
              }}
            >
              {filteredProducts.map((product) => {
                const qty = getCartItemQty(product.id);
                return (
                  <div
                    key={product.id}
                    style={{
                      background: "#090d16",
                      borderRadius: "10px",
                      border: "1px solid #1e293b",
                      padding: "25px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        height: "160px",
                        background: "#0f172a",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "64px",
                        marginBottom: "18px",
                      }}
                    >
                      {product.image}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "8px",
                      }}
                    >
                      <h4
                        style={{
                          margin: 0,
                          fontSize: "20px",
                          fontWeight: "400",
                          color: "#f8fafc",
                        }}
                      >
                        {product.name}
                      </h4>
                      <span
                        style={{
                          color: "#fbbf24",
                          fontSize: "17px",
                          fontWeight: "700",
                          fontFamily: "sans-serif",
                        }}
                      >
                        ₹{product.price}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#d97706",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        fontWeight: "700",
                        marginBottom: "10px",
                        fontFamily: "sans-serif",
                      }}
                    >
                      {product.category} • {product.unit}
                    </span>
                    <p
                      style={{
                        color: "#94a3b8",
                        fontSize: "13px",
                        marginBottom: "20px",
                        lineHeight: "1.5",
                        flexGrow: 1,
                        fontFamily: "sans-serif",
                        fontWeight: "300",
                      }}
                    >
                      {product.desc}
                    </p>

                    <div
                      style={{
                        borderTop: "1px solid #1e293b",
                        paddingTop: "16px",
                      }}
                    >
                      {qty === 0 ? (
                        <button
                          onClick={() => addToCart(product)}
                          style={{
                            background: "#d97706",
                            color: "#fff",
                            border: "none",
                            width: "100%",
                            padding: "11px",
                            borderRadius: "4px",
                            fontWeight: "800",
                            cursor: "pointer",
                            letterSpacing: "1px",
                            fontSize: "12px",
                            fontFamily: "sans-serif",
                          }}
                        >
                          + ADD TO BASKET
                        </button>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            background: "#1e293b",
                            borderRadius: "4px",
                            padding: "4px 10px",
                          }}
                        >
                          <button
                            onClick={() => decreaseCartQty(product.id)}
                            style={{
                              background: "transparent",
                              color: "#fbbf24",
                              border: "none",
                              fontSize: "18px",
                              cursor: "pointer",
                              fontWeight: "800",
                            }}
                          >
                            -
                          </button>
                          <span
                            style={{
                              color: "#fff",
                              fontWeight: "800",
                              fontSize: "14px",
                              fontFamily: "sans-serif",
                            }}
                          >
                            {qty} IN BASKET
                          </span>
                          <button
                            onClick={() => addToCart(product)}
                            style={{
                              background: "transparent",
                              color: "#fbbf24",
                              border: "none",
                              fontSize: "18px",
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
                );
              })}
            </div>
          </div>
        )}

        {/* 3. FLAVIO VISUAL SUBSCRIPTION PLAN CARDS */}
        {currentView === "subscriptionForm" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "45px" }}>
              <span
                style={{
                  color: "#fbbf24",
                  fontSize: "12px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  fontWeight: "800",
                  fontFamily: "sans-serif",
                }}
              >
                AUTOMATED MORNING DELIVERIES
              </span>
              <h2
                style={{
                  fontSize: "38px",
                  fontWeight: "400",
                  margin: "8px 0 10px 0",
                }}
              >
                Choose Your Daily Milk Subscription Plan
              </h2>
              <p
                style={{
                  color: "#cbd5e1",
                  fontSize: "15px",
                  maxWidth: "600px",
                  margin: "0 auto",
                  fontFamily: "sans-serif",
                  fontWeight: "300",
                }}
              >
                Never run out of pure milk in <b>{location}</b>. Select a plan
                below and get guaranteed delivery before 7:00 AM.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "30px",
                marginBottom: "45px",
              }}
            >
              <div
                style={{
                  background: "#090d16",
                  border:
                    selectedPlan === "Daily Regular"
                      ? "2px solid #fbbf24"
                      : "1px solid #1e293b",
                  borderRadius: "12px",
                  padding: "35px",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    background: "#d97706",
                    color: "#fff",
                    fontSize: "10px",
                    fontWeight: "800",
                    letterSpacing: "1px",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    textTransform: "uppercase",
                    fontFamily: "sans-serif",
                  }}
                >
                  MOST POPULAR
                </span>
                <h3
                  style={{
                    fontSize: "26px",
                    fontWeight: "400",
                    margin: "20px 0 8px 0",
                    color: "#f8fafc",
                  }}
                >
                  Daily Regular
                </h3>
                <p
                  style={{
                    color: "#94a3b8",
                    fontSize: "13px",
                    fontFamily: "sans-serif",
                    marginBottom: "25px",
                  }}
                >
                  Fresh milk delivered every single morning 365 days a year.
                </p>

                <div
                  style={{
                    padding: "20px 0",
                    borderTop: "1px solid #1e293b",
                    borderBottom: "1px solid #1e293b",
                    marginBottom: "25px",
                    textAlign: "left",
                    fontFamily: "sans-serif",
                    fontSize: "14px",
                    color: "#cbd5e1",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <span>✓ Delivered every morning before 7:00 AM</span>
                  <span>✓ Free doorstep delivery in {location}</span>
                  <span>✓ Pause or cancel anytime in 1-click</span>
                </div>

                <button
                  onClick={() => {
                    setSelectedPlan("Daily Regular");
                    handleCreateSubscription("Daily Regular");
                  }}
                  style={{
                    background: "#fbbf24",
                    color: "#0f172a",
                    border: "none",
                    width: "100%",
                    padding: "14px",
                    borderRadius: "4px",
                    fontWeight: "800",
                    cursor: "pointer",
                    letterSpacing: "1px",
                    fontSize: "13px",
                    fontFamily: "sans-serif",
                  }}
                >
                  SELECT DAILY PLAN
                </button>
              </div>

              <div
                style={{
                  background: "#090d16",
                  border:
                    selectedPlan === "Alternate Days"
                      ? "2px solid #fbbf24"
                      : "1px solid #1e293b",
                  borderRadius: "12px",
                  padding: "35px",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    background: "#1e293b",
                    color: "#94a3b8",
                    fontSize: "10px",
                    fontWeight: "800",
                    letterSpacing: "1px",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    textTransform: "uppercase",
                    fontFamily: "sans-serif",
                  }}
                >
                  FLEXIBLE
                </span>
                <h3
                  style={{
                    fontSize: "26px",
                    fontWeight: "400",
                    margin: "20px 0 8px 0",
                    color: "#f8fafc",
                  }}
                >
                  Alternate Days
                </h3>
                <p
                  style={{
                    color: "#94a3b8",
                    fontSize: "13px",
                    fontFamily: "sans-serif",
                    marginBottom: "25px",
                  }}
                >
                  Delivered every 2nd day (Mon, Wed, Fri, Sun cycle).
                </p>

                <div
                  style={{
                    padding: "20px 0",
                    borderTop: "1px solid #1e293b",
                    borderBottom: "1px solid #1e293b",
                    marginBottom: "25px",
                    textAlign: "left",
                    fontFamily: "sans-serif",
                    fontSize: "14px",
                    color: "#cbd5e1",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <span>✓ Delivered alternate mornings</span>
                  <span>✓ Ideal for small families</span>
                  <span>✓ Zero hidden delivery charges</span>
                </div>

                <button
                  onClick={() => {
                    setSelectedPlan("Alternate Days");
                    handleCreateSubscription("Alternate Days");
                  }}
                  style={{
                    background: "#1e293b",
                    color: "#fbbf24",
                    border: "1px solid #fbbf24",
                    width: "100%",
                    padding: "14px",
                    borderRadius: "4px",
                    fontWeight: "800",
                    cursor: "pointer",
                    letterSpacing: "1px",
                    fontSize: "13px",
                    fontFamily: "sans-serif",
                  }}
                >
                  SELECT ALTERNATE PLAN
                </button>
              </div>

              <div
                style={{
                  background: "#090d16",
                  border:
                    selectedPlan === "Weekend Special"
                      ? "2px solid #fbbf24"
                      : "1px solid #1e293b",
                  borderRadius: "12px",
                  padding: "35px",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    background: "#1e293b",
                    color: "#94a3b8",
                    fontSize: "10px",
                    fontWeight: "800",
                    letterSpacing: "1px",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    textTransform: "uppercase",
                    fontFamily: "sans-serif",
                  }}
                >
                  SPECIAL
                </span>
                <h3
                  style={{
                    fontSize: "26px",
                    fontWeight: "400",
                    margin: "20px 0 8px 0",
                    color: "#f8fafc",
                  }}
                >
                  Weekend Special
                </h3>
                <p
                  style={{
                    color: "#94a3b8",
                    fontSize: "13px",
                    fontFamily: "sans-serif",
                    marginBottom: "25px",
                  }}
                >
                  Extra fresh milk & curd delivered every Saturday & Sunday.
                </p>

                <div
                  style={{
                    padding: "20px 0",
                    borderTop: "1px solid #1e293b",
                    borderBottom: "1px solid #1e293b",
                    marginBottom: "25px",
                    textAlign: "left",
                    fontFamily: "sans-serif",
                    fontSize: "14px",
                    color: "#cbd5e1",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <span>✓ Saturday & Sunday morning delivery</span>
                  <span>✓ Includes extra curd packet options</span>
                  <span>✓ Flexible start dates</span>
                </div>

                <button
                  onClick={() => {
                    setSelectedPlan("Weekend Special");
                    handleCreateSubscription("Weekend Special");
                  }}
                  style={{
                    background: "#1e293b",
                    color: "#fbbf24",
                    border: "1px solid #fbbf24",
                    width: "100%",
                    padding: "14px",
                    borderRadius: "4px",
                    fontWeight: "800",
                    cursor: "pointer",
                    letterSpacing: "1px",
                    fontSize: "13px",
                    fontFamily: "sans-serif",
                  }}
                >
                  SELECT WEEKEND PLAN
                </button>
              </div>
            </div>

            <div
              style={{
                background: "#090d16",
                padding: "35px",
                borderRadius: "12px",
                border: "1px solid #1e293b",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              <h3
                style={{
                  fontSize: "22px",
                  fontWeight: "400",
                  marginBottom: "20px",
                  color: "#fbbf24",
                  textAlign: "center",
                }}
              >
                Customize Milk Type & Start Date
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "20px",
                  fontFamily: "sans-serif",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "#94a3b8",
                      marginBottom: "8px",
                      fontWeight: "700",
                    }}
                  >
                    SELECT MILK TYPE
                  </label>
                  <select
                    value={subItem}
                    onChange={(e) => setSubItem(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "4px",
                      background: "#0f172a",
                      border: "1px solid #334155",
                      color: "#fff",
                    }}
                  >
                    <option value="A2 Desi Cow Milk">
                      A2 Desi Cow Milk (₹90)
                    </option>
                    <option value="Farm Fresh Cow Milk">
                      Farm Fresh Cow Milk (₹60)
                    </option>
                    <option value="Buffalo Rich Fat Milk">
                      Buffalo Rich Fat Milk (₹70)
                    </option>
                    <option value="Full Cream Gold Milk">
                      Full Cream Gold Milk (₹65)
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "#94a3b8",
                      marginBottom: "8px",
                      fontWeight: "700",
                    }}
                  >
                    DAILY QUANTITY
                  </label>
                  <select
                    value={subQty}
                    onChange={(e) => setSubQty(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "4px",
                      background: "#0f172a",
                      border: "1px solid #334155",
                      color: "#fff",
                    }}
                  >
                    <option value="1 Packet (500ml)">1 Packet (500ml)</option>
                    <option value="2 Packets (1 Litre)">
                      2 Packets (1 Litre)
                    </option>
                    <option value="3 Packets (1.5 Litre)">
                      3 Packets (1.5 Litre)
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "#94a3b8",
                      marginBottom: "8px",
                      fontWeight: "700",
                    }}
                  >
                    START DATE
                  </label>
                  <input
                    type="date"
                    value={subDate}
                    onChange={(e) => setSubDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "11px",
                      borderRadius: "4px",
                      background: "#0f172a",
                      border: "1px solid #334155",
                      color: "#fff",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. ACTIVE SUBSCRIPTIONS VIEW (USER SPECIFIC) */}
        {currentView === "subscriptions" && (
          <div>
            {!currentUser ? (
              <div
                style={{
                  background: "#090d16",
                  padding: "50px",
                  borderRadius: "12px",
                  border: "1px solid #1e293b",
                  maxWidth: "550px",
                  margin: "40px auto",
                  textAlign: "center",
                  fontFamily: "sans-serif",
                }}
              >
                <span
                  style={{
                    fontSize: "48px",
                    display: "block",
                    marginBottom: "15px",
                  }}
                >
                  🔒
                </span>
                <h3
                  style={{
                    color: "#fbbf24",
                    fontSize: "24px",
                    marginBottom: "10px",
                  }}
                >
                  Sign In Required
                </h3>
                <p
                  style={{
                    color: "#cbd5e1",
                    fontSize: "14px",
                    marginBottom: "25px",
                  }}
                >
                  Please Sign In to view your active milk subscription
                  schedules.
                </p>
                <button
                  onClick={() => {
                    setIsSigningUp(false);
                    setCurrentView("login");
                  }}
                  style={{
                    background: "#d97706",
                    color: "#fff",
                    border: "none",
                    padding: "12px 30px",
                    borderRadius: "4px",
                    fontWeight: "800",
                    cursor: "pointer",
                  }}
                >
                  SIGN IN NOW
                </button>
              </div>
            ) : userSubscriptions.length === 0 ? (
              <div
                style={{
                  background: "#090d16",
                  padding: "50px",
                  borderRadius: "12px",
                  border: "1px solid #1e293b",
                  maxWidth: "550px",
                  margin: "40px auto",
                  textAlign: "center",
                  fontFamily: "sans-serif",
                }}
              >
                <span
                  style={{
                    fontSize: "48px",
                    display: "block",
                    marginBottom: "15px",
                  }}
                >
                  🥛
                </span>
                <h3
                  style={{
                    color: "#fbbf24",
                    fontSize: "24px",
                    marginBottom: "10px",
                  }}
                >
                  No Active Subscriptions
                </h3>
                <p
                  style={{
                    color: "#cbd5e1",
                    fontSize: "14px",
                    marginBottom: "25px",
                  }}
                >
                  You have not scheduled any daily milk deliveries yet.
                </p>
                <button
                  onClick={() => setCurrentView("subscriptionForm")}
                  style={{
                    background: "#d97706",
                    color: "#fff",
                    border: "none",
                    padding: "12px 30px",
                    borderRadius: "4px",
                    fontWeight: "800",
                    cursor: "pointer",
                  }}
                >
                  SCHEDULE MILK NOW
                </button>
              </div>
            ) : (
              <div>
                <div style={{ textAlign: "center", marginBottom: "45px" }}>
                  <span
                    style={{
                      color: "#fbbf24",
                      fontSize: "12px",
                      letterSpacing: "3px",
                      textTransform: "uppercase",
                      fontWeight: "800",
                      fontFamily: "sans-serif",
                    }}
                  >
                    YOUR ACTIVE SCHEDULE
                  </span>
                  <h2
                    style={{
                      fontSize: "36px",
                      fontWeight: "400",
                      margin: "8px 0 0 0",
                    }}
                  >
                    Scheduled Milk Subscriptions for {currentUser.name}
                  </h2>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                    gap: "25px",
                  }}
                >
                  {userSubscriptions.map((sub) => (
                    <div
                      key={sub.id}
                      style={{
                        background: "#090d16",
                        padding: "30px",
                        borderRadius: "10px",
                        border: "1px solid #1e293b",
                        borderLeft: `5px solid ${sub.status === "Active" ? "#10b981" : "#ef4444"}`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "15px",
                        }}
                      >
                        <span
                          style={{
                            color: "#fbbf24",
                            fontWeight: "700",
                            fontSize: "14px",
                            fontFamily: "sans-serif",
                          }}
                        >
                          {sub.id}
                        </span>
                        <span
                          style={{
                            background:
                              sub.status === "Active" ? "#064e3b" : "#7f1d1d",
                            color:
                              sub.status === "Active" ? "#6ee7b7" : "#fca5a5",
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontWeight: "800",
                            textTransform: "uppercase",
                            fontFamily: "sans-serif",
                          }}
                        >
                          {sub.status}
                        </span>
                      </div>
                      <h3
                        style={{
                          fontSize: "24px",
                          fontWeight: "400",
                          margin: "0 0 15px 0",
                          color: "#f8fafc",
                        }}
                      >
                        {sub.item}
                      </h3>

                      <div
                        style={{
                          fontFamily: "sans-serif",
                          fontSize: "14px",
                          color: "#cbd5e1",
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          marginBottom: "25px",
                        }}
                      >
                        <span>
                          📦 Quantity: <b>{sub.qty}</b>
                        </span>
                        <span>
                          🔄 Schedule: <b>{sub.frequency}</b>
                        </span>
                        <span>
                          📅 Starts On: <b>{sub.startDate}</b>
                        </span>
                        <span>
                          💵 Price: <b>{sub.price}</b>
                        </span>
                      </div>

                      {sub.status === "Active" && (
                        <button
                          onClick={() => cancelSubscription(sub.id)}
                          style={{
                            background: "#7f1d1d",
                            color: "#fca5a5",
                            border: "none",
                            width: "100%",
                            padding: "12px",
                            borderRadius: "4px",
                            fontWeight: "800",
                            cursor: "pointer",
                            fontSize: "12px",
                            letterSpacing: "1px",
                            fontFamily: "sans-serif",
                          }}
                        >
                          CANCEL SUBSCRIPTION
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. ORDERS & TRACKING VIEW (USER SPECIFIC) */}
        {currentView === "orders" && (
          <div>
            {!currentUser ? (
              <div
                style={{
                  background: "#090d16",
                  padding: "50px",
                  borderRadius: "12px",
                  border: "1px solid #1e293b",
                  maxWidth: "550px",
                  margin: "40px auto",
                  textAlign: "center",
                  fontFamily: "sans-serif",
                }}
              >
                <span
                  style={{
                    fontSize: "48px",
                    display: "block",
                    marginBottom: "15px",
                  }}
                >
                  🔒
                </span>
                <h3
                  style={{
                    color: "#fbbf24",
                    fontSize: "24px",
                    marginBottom: "10px",
                  }}
                >
                  Sign In Required
                </h3>
                <p
                  style={{
                    color: "#cbd5e1",
                    fontSize: "14px",
                    marginBottom: "25px",
                  }}
                >
                  Please Sign In to track your recent fresh orders.
                </p>
                <button
                  onClick={() => {
                    setIsSigningUp(false);
                    setCurrentView("login");
                  }}
                  style={{
                    background: "#d97706",
                    color: "#fff",
                    border: "none",
                    padding: "12px 30px",
                    borderRadius: "4px",
                    fontWeight: "800",
                    cursor: "pointer",
                  }}
                >
                  SIGN IN NOW
                </button>
              </div>
            ) : userOrders.length === 0 ? (
              <div
                style={{
                  background: "#090d16",
                  padding: "50px",
                  borderRadius: "12px",
                  border: "1px solid #1e293b",
                  maxWidth: "550px",
                  margin: "40px auto",
                  textAlign: "center",
                  fontFamily: "sans-serif",
                }}
              >
                <span
                  style={{
                    fontSize: "48px",
                    display: "block",
                    marginBottom: "15px",
                  }}
                >
                  📦
                </span>
                <h3
                  style={{
                    color: "#fbbf24",
                    fontSize: "24px",
                    marginBottom: "10px",
                  }}
                >
                  No Orders Placed Yet
                </h3>
                <p
                  style={{
                    color: "#cbd5e1",
                    fontSize: "14px",
                    marginBottom: "25px",
                  }}
                >
                  Hi <b>{currentUser.name}</b>, you haven't placed any orders
                  yet.
                </p>
                <button
                  onClick={() => setCurrentView("catalog")}
                  style={{
                    background: "#d97706",
                    color: "#fff",
                    border: "none",
                    padding: "12px 30px",
                    borderRadius: "4px",
                    fontWeight: "800",
                    cursor: "pointer",
                  }}
                >
                  BROWSE PRODUCTS
                </button>
              </div>
            ) : (
              <div>
                <div style={{ textAlign: "center", marginBottom: "45px" }}>
                  <span
                    style={{
                      color: "#fbbf24",
                      fontSize: "12px",
                      letterSpacing: "3px",
                      textTransform: "uppercase",
                      fontWeight: "800",
                      fontFamily: "sans-serif",
                    }}
                  >
                    REAL-TIME DELIVERY TRACKING
                  </span>
                  <h2
                    style={{
                      fontSize: "36px",
                      fontWeight: "400",
                      margin: "8px 0 0 0",
                    }}
                  >
                    Recent Orders for {currentUser.name}
                  </h2>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "30px",
                    maxWidth: "900px",
                    margin: "0 auto",
                  }}
                >
                  {userOrders.map((order) => (
                    <div
                      key={order.id}
                      style={{
                        background: "#090d16",
                        padding: "35px",
                        borderRadius: "12px",
                        border: "1px solid #1e293b",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          borderBottom: "1px solid #1e293b",
                          paddingBottom: "20px",
                          marginBottom: "25px",
                        }}
                      >
                        <div>
                          <span
                            style={{
                              color: "#fbbf24",
                              fontWeight: "800",
                              fontSize: "18px",
                              fontFamily: "sans-serif",
                            }}
                          >
                            {order.id}
                          </span>
                          <p
                            style={{
                              color: "#94a3b8",
                              fontSize: "13px",
                              margin: "4px 0 0 0",
                              fontFamily: "sans-serif",
                            }}
                          >
                            Placed on {order.date} • Paid via{" "}
                            <b>{order.payment || "COD"}</b>
                          </p>
                          <p
                            style={{
                              color: "#f8fafc",
                              fontSize: "15px",
                              margin: "12px 0 0 0",
                              fontFamily: "sans-serif",
                              fontWeight: "600",
                            }}
                          >
                            Items: {order.items}
                          </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span
                            style={{
                              fontSize: "26px",
                              fontWeight: "700",
                              color: "#fbbf24",
                              fontFamily: "sans-serif",
                            }}
                          >
                            ₹{order.total}
                          </span>
                          <p
                            style={{
                              margin: "6px 0 0 0",
                              color:
                                order.status === "Cancelled"
                                  ? "#ef4444"
                                  : "#10b981",
                              fontWeight: "800",
                              fontSize: "13px",
                              textTransform: "uppercase",
                              fontFamily: "sans-serif",
                              letterSpacing: "1px",
                            }}
                          >
                            {order.status}
                          </p>
                        </div>
                      </div>

                      {order.status !== "Cancelled" ? (
                        <div>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr 1fr 1fr",
                              gap: "10px",
                              textAlign: "center",
                              margin: "30px 0",
                              fontFamily: "sans-serif",
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "50%",
                                  background: "#10b981",
                                  color: "#fff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  margin: "0 auto 10px auto",
                                  fontWeight: "800",
                                  fontSize: "14px",
                                }}
                              >
                                ✓
                              </div>
                              <span
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "700",
                                  color: "#f8fafc",
                                  display: "block",
                                }}
                              >
                                Order Placed
                              </span>
                              <span
                                style={{ fontSize: "10px", color: "#94a3b8" }}
                              >
                                Verified
                              </span>
                            </div>
                            <div>
                              <div
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "50%",
                                  background: "#10b981",
                                  color: "#fff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  margin: "0 auto 10px auto",
                                  fontWeight: "800",
                                  fontSize: "14px",
                                }}
                              >
                                ✓
                              </div>
                              <span
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "700",
                                  color: "#f8fafc",
                                  display: "block",
                                }}
                              >
                                Confirmed
                              </span>
                              <span
                                style={{ fontSize: "10px", color: "#94a3b8" }}
                              >
                                Packed Fresh
                              </span>
                            </div>
                            <div>
                              <div
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "50%",
                                  background: "#d97706",
                                  color: "#fff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  margin: "0 auto 10px auto",
                                  fontWeight: "800",
                                  fontSize: "14px",
                                }}
                              >
                                🚚
                              </div>
                              <span
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "700",
                                  color: "#fbbf24",
                                  display: "block",
                                }}
                              >
                                On the Way
                              </span>
                              <span
                                style={{ fontSize: "10px", color: "#94a3b8" }}
                              >
                                Executive Assigned
                              </span>
                            </div>
                            <div>
                              <div
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "50%",
                                  background: "#1e293b",
                                  color: "#64748b",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  margin: "0 auto 10px auto",
                                  fontWeight: "800",
                                  fontSize: "14px",
                                }}
                              >
                                🏠
                              </div>
                              <span
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  color: "#64748b",
                                  display: "block",
                                }}
                              >
                                Delivered
                              </span>
                              <span
                                style={{ fontSize: "10px", color: "#64748b" }}
                              >
                                Before 7 AM
                              </span>
                            </div>
                          </div>

                          <div
                            style={{
                              borderTop: "1px solid #1e293b",
                              paddingTop: "20px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontFamily: "sans-serif",
                            }}
                          >
                            <span
                              style={{ fontSize: "13px", color: "#cbd5e1" }}
                            >
                              📍 Address: <b>{order.address}</b>
                            </span>
                            <button
                              onClick={() => cancelOrder(order.id)}
                              style={{
                                background: "#7f1d1d",
                                color: "#fca5a5",
                                border: "none",
                                padding: "10px 20px",
                                borderRadius: "4px",
                                fontWeight: "800",
                                cursor: "pointer",
                                fontSize: "12px",
                                letterSpacing: "1px",
                              }}
                            >
                              CANCEL ORDER
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          style={{
                            background: "#450a0a",
                            border: "1px solid #7f1d1d",
                            padding: "15px",
                            borderRadius: "6px",
                            textAlign: "center",
                            color: "#fca5a5",
                            fontWeight: "700",
                            fontSize: "13px",
                            fontFamily: "sans-serif",
                          }}
                        >
                          ❌ Order cancelled. Refund processed.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. CART VIEW */}
        {currentView === "cart" && (
          <div
            style={{
              background: "#090d16",
              padding: "45px",
              borderRadius: "12px",
              border: "1px solid #1e293b",
              maxWidth: "850px",
              margin: "0 auto",
            }}
          >
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "400",
                marginBottom: "30px",
                color: "#fbbf24",
                textAlign: "center",
              }}
            >
              Your Fresh Basket
            </h2>

            {cart.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 0",
                  fontFamily: "sans-serif",
                }}
              >
                <p
                  style={{
                    color: "#94a3b8",
                    fontSize: "16px",
                    marginBottom: "25px",
                  }}
                >
                  Your shopping basket is currently empty.
                </p>
                <button
                  onClick={() => setCurrentView("catalog")}
                  style={{
                    background: "#d97706",
                    color: "#fff",
                    border: "none",
                    padding: "12px 30px",
                    borderRadius: "4px",
                    fontWeight: "800",
                    cursor: "pointer",
                  }}
                >
                  BROWSE DAIRY CATALOGUE
                </button>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: "30px" }}>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "18px 0",
                        borderBottom: "1px solid #1e293b",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "20px",
                        }}
                      >
                        <span style={{ fontSize: "40px" }}>{item.image}</span>
                        <div>
                          <h4
                            style={{
                              margin: "0 0 4px 0",
                              fontWeight: "400",
                              fontSize: "20px",
                              color: "#f8fafc",
                            }}
                          >
                            {item.name}
                          </h4>
                          <span
                            style={{
                              color: "#94a3b8",
                              fontSize: "14px",
                              fontFamily: "sans-serif",
                            }}
                          >
                            ₹{item.price} x {item.qty} ={" "}
                            <b style={{ color: "#fbbf24" }}>
                              ₹{item.price * item.qty}
                            </b>
                          </span>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "20px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            background: "#1e293b",
                            borderRadius: "4px",
                            border: "1px solid #334155",
                          }}
                        >
                          <button
                            onClick={() => decreaseCartQty(item.id)}
                            style={{
                              background: "transparent",
                              color: "#fbbf24",
                              border: "none",
                              padding: "6px 14px",
                              cursor: "pointer",
                              fontWeight: "800",
                            }}
                          >
                            -
                          </button>
                          <span
                            style={{
                              padding: "0 10px",
                              fontWeight: "700",
                              color: "#fff",
                              fontFamily: "sans-serif",
                            }}
                          >
                            {item.qty}
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            style={{
                              background: "transparent",
                              color: "#fbbf24",
                              border: "none",
                              padding: "6px 14px",
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
                            background: "#7f1d1d",
                            color: "#fca5a5",
                            border: "none",
                            padding: "8px 14px",
                            borderRadius: "4px",
                            fontWeight: "700",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontFamily: "sans-serif",
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
                    fontSize: "22px",
                    fontWeight: "700",
                    marginBottom: "35px",
                    background: "#0f172a",
                    padding: "20px",
                    borderRadius: "8px",
                    border: "1px solid #1e293b",
                    fontFamily: "sans-serif",
                  }}
                >
                  <span>Grand Total:</span>
                  <span style={{ color: "#fbbf24" }}>₹{calculateTotal()}</span>
                </div>

                <form
                  onSubmit={handleCheckout}
                  style={{ fontFamily: "sans-serif" }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      marginBottom: "15px",
                      color: "#fbbf24",
                    }}
                  >
                    Delivery Address ({location})
                  </h3>
                  <div style={{ marginBottom: "30px" }}>
                    <input
                      type="text"
                      placeholder="Street address, door number, area in Tamil Nadu..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: "4px",
                        background: "#0f172a",
                        border: "1px solid #334155",
                        outline: "none",
                        color: "#fff",
                        fontSize: "14px",
                      }}
                      required
                    />
                  </div>

                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      marginBottom: "15px",
                      color: "#fbbf24",
                    }}
                  >
                    Payment Mode
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "15px",
                      marginBottom: "35px",
                    }}
                  >
                    {[
                      { id: "COD", label: "💵 Cash on Delivery" },
                      { id: "UPI", label: "📱 UPI (GPay / PhonePe)" },
                      { id: "Card", label: "💳 Credit / Debit Card" },
                      { id: "NetBanking", label: "🏦 Net Banking" },
                    ].map((pay) => (
                      <label
                        key={pay.id}
                        style={{
                          padding: "16px",
                          borderRadius: "6px",
                          border:
                            paymentMethod === pay.id
                              ? "2px solid #fbbf24"
                              : "1px solid #1e293b",
                          background:
                            paymentMethod === pay.id ? "#1e293b" : "#0f172a",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={pay.id}
                          checked={paymentMethod === pay.id}
                          onChange={() => setPaymentMethod(pay.id)}
                        />
                        <span
                          style={{
                            fontWeight: "700",
                            fontSize: "14px",
                            color: "#f8fafc",
                          }}
                        >
                          {pay.label}
                        </span>
                      </label>
                    ))}
                  </div>

                  <button
                    type="submit"
                    style={{
                      background: "#d97706",
                      color: "#fff",
                      border: "none",
                      width: "100%",
                      padding: "16px",
                      borderRadius: "4px",
                      fontWeight: "800",
                      fontSize: "15px",
                      cursor: "pointer",
                      letterSpacing: "1px",
                    }}
                  >
                    CONFIRM & PLACE ORDER (₹{calculateTotal()})
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* 7. AUTHENTICATION */}
        {currentView === "login" && (
          <div
            style={{
              background: "#090d16",
              padding: "40px",
              borderRadius: "12px",
              maxWidth: "450px",
              margin: "30px auto",
              border: "1px solid #1e293b",
              fontFamily: "sans-serif",
            }}
          >
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "400",
                marginBottom: "8px",
                color: "#fbbf24",
                textAlign: "center",
                fontFamily: "serif",
              }}
            >
              {isSigningUp ? "Create Account" : "Customer Sign In"}
            </h2>
            <p
              style={{
                color: "#94a3b8",
                textAlign: "center",
                marginBottom: "30px",
                fontSize: "13px",
              }}
            >
              {isSigningUp
                ? "Sign up for automated fresh milk deliveries."
                : "Access your fresh orders & subscriptions."}
            </p>

            {authError && (
              <div
                style={{
                  backgroundColor: "#7f1d1d",
                  color: "#fca5a5",
                  padding: "12px",
                  borderRadius: "4px",
                  marginBottom: "20px",
                  fontSize: "13px",
                  border: "1px solid #ef4444",
                }}
              >
                ⚠️ {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit}>
              {isSigningUp && (
                <div style={{ marginBottom: "18px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "13px",
                      color: "#cbd5e1",
                    }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "4px",
                      background: "#0f172a",
                      border: "1px solid #334155",
                      color: "#fff",
                      outline: "none",
                    }}
                    required
                  />
                </div>
              )}

              <div style={{ marginBottom: "18px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "13px",
                    color: "#cbd5e1",
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "4px",
                    background: "#0f172a",
                    border: "1px solid #334155",
                    color: "#fff",
                    outline: "none",
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: "25px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "13px",
                    color: "#cbd5e1",
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "4px",
                    background: "#0f172a",
                    border: "1px solid #334155",
                    color: "#fff",
                    outline: "none",
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                style={{
                  background: "#d97706",
                  color: "#fff",
                  border: "none",
                  width: "100%",
                  padding: "14px",
                  borderRadius: "4px",
                  fontWeight: "800",
                  cursor: "pointer",
                  fontSize: "14px",
                  letterSpacing: "1px",
                  marginBottom: "20px",
                }}
              >
                {isSigningUp ? "CREATE ACCOUNT" : "SIGN IN"}
              </button>
            </form>

            <div
              style={{
                textAlign: "center",
                fontSize: "13px",
                color: "#94a3b8",
                borderTop: "1px solid #1e293b",
                paddingTop: "18px",
              }}
            >
              {isSigningUp ? (
                <p>
                  Already registered?{" "}
                  <span
                    onClick={() => {
                      setIsSigningUp(false);
                      setAuthError("");
                    }}
                    style={{
                      color: "#fbbf24",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    Sign In here
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
                      color: "#fbbf24",
                      fontWeight: "700",
                      cursor: "pointer",
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
              background: "#090d16",
              padding: "45px",
              borderRadius: "12px",
              maxWidth: "500px",
              margin: "30px auto",
              border: "1px solid #1e293b",
              textAlign: "center",
              fontFamily: "sans-serif",
            }}
          >
            <div style={{ fontSize: "64px", marginBottom: "15px" }}>👤</div>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "400",
                marginBottom: "4px",
                color: "#f8fafc",
                fontFamily: "serif",
              }}
            >
              {currentUser.name}
            </h2>
            <p
              style={{
                color: "#94a3b8",
                marginBottom: "30px",
                fontSize: "14px",
              }}
            >
              {currentUser.email}
            </p>

            <div
              style={{
                background: "#0f172a",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "30px",
                textAlign: "left",
                border: "1px solid #1e293b",
                fontSize: "14px",
                color: "#cbd5e1",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <p style={{ margin: 0 }}>
                📍 <b>Location:</b> {location}
              </p>
              <p style={{ margin: 0 }}>
                🥛 <b>Active Subscriptions:</b>{" "}
                {userSubscriptions.filter((s) => s.status === "Active").length}{" "}
                Active
              </p>
              <p style={{ margin: 0 }}>
                📦 <b>Total Orders:</b> {userOrders.length} Orders
              </p>
            </div>

            <button
              onClick={handleLogout}
              style={{
                background: "#7f1d1d",
                color: "#fca5a5",
                border: "none",
                width: "100%",
                padding: "12px",
                borderRadius: "4px",
                fontWeight: "800",
                cursor: "pointer",
                fontSize: "13px",
                letterSpacing: "1px",
              }}
            >
              LOGOUT ACCOUNT
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
  fontSize: "12px",
  fontWeight: isActive ? "800" : "600",
  color: isActive ? "#fbbf24" : "#cbd5e1",
  padding: "6px 0",
  borderBottom: isActive ? "2px solid #fbbf24" : "none",
});

export default App;
