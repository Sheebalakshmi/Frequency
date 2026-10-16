from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def init_db():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id TEXT,
            items TEXT,
            total INTEGER,
            address TEXT,
            payment_method TEXT,
            status TEXT,
            date TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route('/api/orders', methods=['GET'])
def get_orders():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT order_id, items, total, address, payment_method, status, date FROM orders ORDER BY id DESC')
    rows = cursor.fetchall()
    conn.close()
    
    orders = []
    for r in rows:
        orders.append({
            'id': r[0],
            'items': r[1],
            'total': r[2],
            'address': r[3],
            'payment': r[4],
            'status': r[5],
            'date': r[6]
        })
    return jsonify(orders)

@app.route('/api/orders', methods=['POST'])
def place_order():
    data = request.json
    order_id = data.get('id')
    items = data.get('items')
    total = data.get('total')
    address = data.get('address')
    payment_method = data.get('payment')
    status = data.get('status', 'Order Placed & Confirmed')
    date = data.get('date')

    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO orders (order_id, items, total, address, payment_method, status, date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (order_id, items, total, address, payment_method, status, date))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Order placed successfully!', 'order_id': order_id}), 201

@app.route('/api/orders/cancel', methods=['POST'])
def cancel_order():
    data = request.json
    order_id = data.get('order_id')

    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('UPDATE orders SET status = ? WHERE order_id = ?', ('Cancelled', order_id))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Order cancelled successfully!'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)