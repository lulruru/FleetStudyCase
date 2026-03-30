import React, { useState } from "react";
import * as api from "../api";

const DEFAULT_PRODUCT_FORM = {
  name: "",
  description: "",
  price: "",
  stock: "",
};

function Catalog({ products, onAddToCart, onOpenCart, onProductCreated }) {
  const [form, setForm] = useState(DEFAULT_PRODUCT_FORM);
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const data = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    if (editingProductId) {
      await api.updateProduct(editingProductId, data);
    } else {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    setForm(DEFAULT_PRODUCT_FORM);
    setShowForm(false);
    setEditingProductId(null);
    onProductCreated();
  }

  function beginEdit(product) {
    setEditingProductId(product.id);
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      stock: product.stock,
    });
    setShowForm(true);
  }

  function cancelForm() {
    setForm(DEFAULT_PRODUCT_FORM);
    setEditingProductId(null);
    setShowForm(false);
  }

  return (
    <section className="panel">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Catalog</h2>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() => {
              cancelForm();
              setShowForm(!showForm);
            }}
          >
            {showForm ? "Cancel" : "+ Add product"}
          </button>
          <button type="button" onClick={onOpenCart}>
            🛒 Cart
          </button>
        </div>
      </div>

      {showForm ? (
        <form className="app-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Product name"
              required
            />
          </label>
          <label>
            Description
            <input
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Description"
            />
          </label>
          <label>
            Price (€)
            <input
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, price: e.target.value }))
              }
              placeholder="0"
              required
              min="0"
            />
          </label>
          <label>
            Stock
            <input
              type="number"
              value={form.stock}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, stock: e.target.value }))
              }
              placeholder="0"
              required
              min="0"
            />
          </label>
          <div className="form-buttons">
            <button type="submit">
              {editingProductId ? "Update" : "Create product"}
            </button>
            {editingProductId ? (
              <button type="button" onClick={cancelForm}>
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      ) : null}

      <table style={{ marginTop: "24px" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description || "-"}</td>
              <td>{product.price} €</td>
              <td>{product.stock}</td>
              <td style={{ display: "flex", gap: "8px" }}>
                <button type="button" onClick={() => beginEdit(product)}>
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onAddToCart(product.id)}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? "Out of stock" : "Add to cart"}
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 ? (
            <tr>
              <td colSpan="5">No products found</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </section>
  );
}

export default Catalog;
