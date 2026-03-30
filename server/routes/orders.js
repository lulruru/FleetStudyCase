const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/orders", (req, res) => {
    db.all("SELECT * FROM orders ORDER BY id DESC", [], (err, orders) => {
      if (err)
        return res.status(500).json({ message: "Failed to fetch orders" });
      if (orders.length === 0) return res.json([]);

      const orderIds = orders.map((o) => o.id);
      db.all(
        `SELECT * FROM order_items WHERE order_id IN (${orderIds.map(() => "?").join(",")})`,
        orderIds,
        (err2, items) => {
          if (err2)
            return res
              .status(500)
              .json({ message: "Failed to fetch order items" });
          const result = orders.map((order) => ({
            ...order,
            items: items.filter((i) => i.order_id === order.id),
          }));
          res.json(result);
        },
      );
    });
  });

  router.post("/orders", (req, res) => {
    db.all(
      `SELECT ci.id, ci.quantity, ci.product_id, p.name, p.price
       FROM cart_items ci JOIN products p ON p.id = ci.product_id`,
      [],
      (err, cartItems) => {
        if (err)
          return res.status(500).json({ message: "Failed to read cart" });
        if (cartItems.length === 0)
          return res.status(400).json({ message: "Cart is empty" });

        const total = cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );

        db.run(
          "INSERT INTO orders (total) VALUES (?)",
          [total],
          function (err2) {
            if (err2)
              return res
                .status(500)
                .json({ message: "Failed to create order" });
            const orderId = this.lastID;

            const stmt = db.prepare(
              "INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity) VALUES (?, ?, ?, ?, ?)",
            );
            cartItems.forEach((item) => {
              stmt.run([
                orderId,
                item.product_id,
                item.name,
                item.price,
                item.quantity,
              ]);
            });
            stmt.finalize((err3) => {
              if (err3)
                return res
                  .status(500)
                  .json({ message: "Failed to save order items" });
              db.run("DELETE FROM cart_items", [], (err4) => {
                if (err4)
                  return res.status(500).json({
                    message: "Order created but failed to clear cart",
                  });
                res.status(201).json({ success: true, orderId });
              });
            });
          },
        );
      },
    );
  });

  return router;
};
