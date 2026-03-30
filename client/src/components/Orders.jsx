import React from "react";

function Orders({ orders }) {
  return (
    <section className="panel">
      <h2>Order History</h2>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              marginBottom: "24px",
              border: "1px solid #eee",
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <strong>Order #{order.id}</strong>
              <span>{new Date(order.created_at).toLocaleDateString()}</span>
              <strong>{order.total.toFixed(2)} €</strong>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Unit price</th>
                  <th>Qty</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.product_name}</td>
                    <td>{item.product_price.toFixed(2)} €</td>
                    <td>{item.quantity}</td>
                    <td>{(item.product_price * item.quantity).toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </section>
  );
}

export default Orders;
