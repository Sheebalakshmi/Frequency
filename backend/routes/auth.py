from flask import Blueprint, request, jsonify
import sqlite3
import os

auth_bp = Blueprint('auth', __name__)
DB_PATH = os.path.join(os.path.dirname(__file__), '../database.db')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Users Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            phone TEXT
        )
    ''')
    
    # Products Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            price REAL NOT NULL,
            image TEXT
        )
    ''')

    # Cart Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS cart (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            product_id INTEGER,
            quantity INTEGER DEFAULT 1
        )
    ''')

    # Orders Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            total_amount REAL,
            address TEXT,
            status TEXT DEFAULT 'Placed'
        )
    ''')

    # Subscriptions Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS subscriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            item_name TEXT,
            frequency TEXT,
            start_date TEXT
        )
    ''')

    # Insert Sample Products if empty
    cursor.execute("SELECT COUNT(*) FROM products")
    if cursor.fetchone()[0] == 0:
        sample_products = [
            ('Farm Fresh Milk (1L)', 'Dairy', 60.0, '🥛'),
            ('Organic Curd (500g)', 'Dairy', 40.0, '🥣'),
            ('Fresh Paneer (200g)', 'Dairy', 110.0, '🧀'),
            ('Whole Wheat Bread', 'Grocery', 45.0, '🍞'),
            ('Fresh Eggs (6 pcs)', 'Grocery', 42.0, '🥚')
        ]
        cursor.executemany("INSERT INTO products (name, category, price, image) VALUES (?, ?, ?, ?)", sample_products)

    conn.commit()
    conn.close()

init_db()

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# AUTH APIs
@auth_bp.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    name, email, password, phone = data.get('name'), data.get('email'), data.get('password'), data.get('phone', '')
    if not name or not email or not password:
        return jsonify({"message": "All fields required"}), 400
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)", (name, email, password, phone))
        conn.commit()
        conn.close()
        return jsonify({"message": "Registered successfully!"}), 201
    except Exception as e:
        return jsonify({"message": "Email already exists or DB Error"}), 400

@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email, password = data.get('email'), data.get('password')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ? AND password = ?", (email, password))
    user = cursor.fetchone()
    conn.close()
    if user:
        return jsonify({"message": "Login successful", "user": {"id": user['id'], "name": user['name'], "email": user['email']}}), 200
    return jsonify({"message": "Invalid credentials"}), 401

# PRODUCT APIs
@auth_bp.route('/api/products', methods=['GET'])
def get_products():
    conn = get_db_connection()
    products = conn.execute("SELECT * FROM products").fetchall()
    conn.close()
    return jsonify([dict(p) for p in products]), 200

# CART APIs
@auth_bp.route('/api/cart', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    user_id, product_id = data.get('user_id'), data.get('product_id')
    conn = get_db_connection()
    conn.execute("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, 1)", (user_id, product_id))
    conn.commit()
    conn.close()
    return jsonify({"message": "Added to cart"}), 201

@auth_bp.route('/api/cart/<int:user_id>', methods=['GET'])
def get_cart(user_id):
    conn = get_db_connection()
    query = '''SELECT c.id as cart_id, p.name, p.price, c.quantity 
               FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?'''
    items = conn.execute(query, (user_id,)).fetchall()
    conn.close()
    return jsonify([dict(i) for i in items]), 200

# ORDER APIs
@auth_bp.route('/api/orders', methods=['POST'])
def place_order():
    data = request.get_json()
    user_id, total, address = data.get('user_id'), data.get('total'), data.get('address')
    conn = get_db_connection()
    conn.execute("INSERT INTO orders (user_id, total_amount, address) VALUES (?, ?, ?)", (user_id, total, address))
    conn.execute("DELETE FROM cart WHERE user_id = ?", (user_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Order placed successfully!"}), 201

@auth_bp.route('/api/orders/<int:user_id>', methods=['GET'])
def get_orders(user_id):
    conn = get_db_connection()
    orders = conn.execute("SELECT * FROM orders WHERE user_id = ?", (user_id,)).fetchall()
    conn.close()
    return jsonify([dict(o) for o in orders]), 200

# SUBSCRIPTION APIs
@auth_bp.route('/api/subscriptions', methods=['POST'])
def add_subscription():
    data = request.get_json()
    user_id, item_name, frequency, start_date = data.get('user_id'), data.get('item_name'), data.get('frequency'), data.get('start_date')
    conn = get_db_connection()
    conn.execute("INSERT INTO subscriptions (user_id, item_name, frequency, start_date) VALUES (?, ?, ?, ?)", 
                 (user_id, item_name, frequency, start_date))
    conn.commit()
    conn.close()
    return jsonify({"message": "Subscription created successfully!"}), 201

@auth_bp.route('/api/subscriptions/<int:user_id>', methods=['GET'])
def get_subscriptions(user_id):
    conn = get_db_connection()
    try:
        subs = conn.execute("SELECT * FROM subscriptions WHERE user_id = ?", (user_id,)).fetchall()
        conn.close()
        return jsonify([dict(s) for s in subs]), 200
    except Exception as e:
        conn.close()
        return jsonify([]), 200