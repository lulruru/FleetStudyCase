export async function fetchProducts() {
  const res = await fetch("/api/products");
  return res.json();
}

export async function fetchCart() {
  const res = await fetch("/api/cart");
  return res.json();
}

export async function fetchOrders() {
  const res = await fetch("/api/orders");
  return res.json();
}

export async function addToCart(productId) {
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, quantity: 1 }),
  });
  return res.json();
}

export async function updateCartQuantity(cartItemId, quantity) {
  const res = await fetch(`/api/cart/${cartItemId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });
  return res.json();
}

export async function removeFromCart(cartItemId) {
  const res = await fetch(`/api/cart/${cartItemId}`, { method: "DELETE" });
  return res.json();
}

export async function checkout() {
  const res = await fetch("/api/orders", { method: "POST" });
  return res.json();
}

export async function updateProduct(id, data) {
  const res = await fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}