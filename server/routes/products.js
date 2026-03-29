const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/products", (req, res) => {
    db.all("SELECT * FROM products ORDER BY id DESC", [], (err, rows) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Failed to fetch products", detail: err.message });
      res.json(rows);
    });
  });
  router.post("/products", (req, res) => {
    const { name, description, price, stock } = req.body || {};
    if (!name || price == null)
      return res.status(400).json({ message: "name and price are required" });
    db.run(
      "INSERT INTO products (name , description, price, stock) VALUES (?, ?, ?, ?)",
      [name.trim(), description || "", Number(price), Number(stock) || 0],
      function (err) {
        if (err)
          return res
            .status(500)
            .json({ message: "Failed to create product", detail: err.message });
        db.get(
          "SELECT * FROM products WHERE id = ?",
          [this.lastID],
          (err2, row) => {
            if (err2)
              return res
                .status(500)
                .json({ message: "Created but failed to fetch" });
            res.status(201).json(row);
          },
        );
      },
    );
  });
  return router;
};
