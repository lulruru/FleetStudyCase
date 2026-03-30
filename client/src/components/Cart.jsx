import React from "react";

function Cart({ cart, onUpdateQuantity, onRemove, onCheckout, onClose }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "350px",
        height: "100vh",
        overflowY: "hidden",
		boxSizing: "border-box",
        background: "white",
        boxShadow: "-2px 0 8px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
        padding: "24px",
		paddingBottom: "0px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ margin: 0 }}>🛒 Cart</h2>
        <button type="button" onClick={onClose}>
          ✕
        </button>
      </div>

      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {cart.map((item) => (
              <div
                key={item.id}
                style={{
                  marginBottom: "16px",
                  borderBottom: "1px solid #eee",
                  paddingBottom: "16px",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <strong>{item.name}</strong>
                  <span>{(item.price * item.quantity).toFixed(2)} €</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "8px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    style={{ marginLeft: "auto", color: "red" }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              borderTop: "2px solid #eee",
              paddingTop: "16px",
              marginTop: "16px",
			  paddingBottom: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <strong>Total</strong>
              <strong>{total.toFixed(2)} €</strong>
            </div>
            <button
              type="button"
              onClick={onCheckout}
              style={{ width: "100%" }}
            >
              Place order
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
