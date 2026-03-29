const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/cart", (req, res) => {
    db.all(
      `SELECT ci.id, ci.quantity, ci.product_id, p.name, p.price, p.stock
			 FROM cart_items ci JOIN products p ON p.id = ci.product_id
			 ORDER BY ci.id ASC`,
      [],
      (err, rows) => {
        if (err)
          return res
            .status(500)
            .json({ message: "Failed to fetch cart", detail: err.message });
        res.json(rows);
      },
    );
  });

  router.post("/cart", (req, res) => {
    const productId = Number(req.body?.productId);
    const quantity = Number(req.body?.quantity) || 1;
    if (!productId)
      return res.status(400).json({ message: "productId is required" });

    db.get(
      "SELECT * FROM products WHERE id = ?",
      [productId],
      (err, product) => {
        if (err || !product)
          return res.status(404).json({ message: "Product not found" });
        if (product.stock < quantity)
          return res.status(400).json({ message: "Not enough stock" });

        db.get(
          "SELECT * FROM cart_items WHERE product_id = ?",
          [productId],
          (err2, existing) => {
            if (existing) {
              db.run(
                "UPDATE cart_items SET quantity = quantity + ? WHERE product_id = ?",
                [quantity, productId],
                (err3) => {
                  if (err3)
                    return res
                      .status(500)
                      .json({ message: "Failed to update cart" });
                  db.run("UPDATE products SET stock = stock - ? WHERE id = ?", [
                    quantity,
                    productId,
                  ]);
                  res.json({ success: true });
                },
              );
            } else {
              db.run(
                "INSERT INTO cart_items (product_id, quantity) VALUES (?, ?)",
                [productId, quantity],
                (err3) => {
                  if (err3)
                    return res
                      .status(500)
                      .json({ message: "Failed to add to cart" });
                  db.run("UPDATE products SET stock = stock - ? WHERE id = ?", [
                    quantity,
                    productId,
                  ]);
                  res.status(201).json({ success: true });
                },
              );
            }
          },
        );
      },
    );
  });

  router.put("/cart/:id", (req, res) => {
    const id = Number(req.params.id);
    const newQuantity = Number(req.body?.quantity);
    if (!newQuantity || newQuantity < 1)
      return res.status(400).json({ message: "quantity must be >= 1" });

    db.get("SELECT * FROM cart_items WHERE id = ?", [id], (err, item) => {
      if (err || !item)
        return res.status(404).json({ message: "Cart item not found" });

      const diff = newQuantity - item.quantity;

      db.get(
        "SELECT * FROM products WHERE id = ?",
        [item.product_id],
        (err2, product) => {
          if (err2 || !product)
            return res.status(404).json({ message: "Product not found" });
          if (diff > 0 && product.stock < diff)
            return res.status(400).json({ message: "Not enough stock" });

          db.run(
            "UPDATE cart_items SET quantity = ? WHERE id = ?",
            [newQuantity, id],
            (err3) => {
              if (err3)
                return res
                  .status(500)
                  .json({ message: "Failed to update cart item" });
              db.run("UPDATE products SET stock = stock - ? WHERE id = ?", [
                diff,
                item.product_id,
              ]);
              res.json({ success: true });
            },
          );
        },
      );
    });
  });

  router.delete("/cart/:id", (req, res) => {
    const id = Number(req.params.id);

    db.get("SELECT * FROM cart_items WHERE id = ?", [id], (err, item) => {
      if (err || !item)
        return res.status(404).json({ message: "Cart item not found" });

      db.run("DELETE FROM cart_items WHERE id = ?", [id], function (err2) {
        if (err2)
          return res.status(500).json({ message: "Failed to remove item" });
        db.run("UPDATE products SET stock = stock + ? WHERE id = ?", [
          item.quantity,
          item.product_id,
        ]);
        res.json({ success: true });
      });
    });
  });
  
  return router;
};
