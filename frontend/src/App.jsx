import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const API_URL = "http://localhost:5001";

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch products"
        );
      }

      setProducts(data);
    } catch (error) {
      console.error("Fetch Products Error:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      name.trim() === "" ||
      price === "" ||
      category.trim() === "" ||
      stock === ""
    ) {
      alert("Please fill all fields");
      return;
    }

    const productData = {
      name: name.trim(),
      price: Number(price),
      category: category.trim(),
      stock: Number(stock),
    };

    try {
      let response;

      if (editingId) {
        response = await fetch(
          `${API_URL}/api/products/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(productData),
          }
        );
      } else {
        response = await fetch(
          `${API_URL}/api/products`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(productData),
          }
        );
      }

      const data = await response.json();

      console.log("Backend Response:", data);

      if (!response.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      alert(
        editingId
          ? "Product updated successfully!"
          : "Product added successfully!"
      );

      setName("");
      setPrice("");
      setCategory("");
      setStock("");
      setEditingId(null);

      await fetchProducts();
    } catch (error) {
      console.error("Add/Update Product Error:", error);

      alert("Unable to connect to backend.");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);

    setName(product.name);
    setPrice(product.price);
    setCategory(product.category);
    setStock(product.stock);
  };

  const handleCancelEdit = () => {
    setEditingId(null);

    setName("");
    setPrice("");
    setCategory("");
    setStock("");
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/products/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message || "Failed to delete product"
        );
        return;
      }

      alert("Product deleted successfully!");

      await fetchProducts();
    } catch (error) {
      console.error("Delete Product Error:", error);

      alert("Unable to connect to backend.");
    }
  };

  const filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase();

    return (
      product.name.toLowerCase().includes(searchText) ||
      product.category.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="app">

      {/* HEADER */}

      <header className="header">
        <div className="brand-section">
          <div className="brand-icon">P</div>

          <div>
            <h1>Product Manager</h1>
            <p>
              Add, update, search and manage your products.
            </p>
          </div>
        </div>

        <div className="header-badge">
          <span className="status-dot"></span>
          Local Database
        </div>
      </header>


      {/* FORM */}

      <section className="form-card">

        <div className="section-heading">

          <div>
            <span className="section-label">
              PRODUCT MANAGEMENT
            </span>

            <h2>
              {editingId
                ? "Update Product"
                : "Add New Product"}
            </h2>
          </div>

          <div className="form-icon">
            {editingId ? "✎" : "+"}
          </div>

        </div>

        <form
          className="product-form"
          onSubmit={handleSubmit}
        >

          <div className="input-group">
            <label>Product Name</label>

            <input
              type="text"
              placeholder="e.g. MacBook Air"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          </div>


          <div className="input-group">
            <label>Price</label>

            <div className="input-with-symbol">
              <span>₹</span>

              <input
                type="number"
                placeholder="e.g. 50000"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
              />
            </div>
          </div>


          <div className="input-group">
            <label>Category</label>

            <input
              type="text"
              placeholder="e.g. Electronics"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            />
          </div>


          <div className="input-group">
            <label>Stock</label>

            <input
              type="number"
              placeholder="e.g. 25"
              value={stock}
              onChange={(e) =>
                setStock(e.target.value)
              }
            />
          </div>


          <div className="form-actions">

            <button
              type="submit"
              className="primary-btn"
            >
              <span>
                {editingId ? "✓" : "+"}
              </span>

              {editingId
                ? "Update Product"
                : "Add Product"}
            </button>


            {editingId && (
              <button
                type="button"
                className="secondary-btn"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </section>


      {/* SEARCH */}

      <section className="search-box">

        <div className="search-icon">
          🔍
        </div>

        <input
          type="text"
          placeholder="Search products by name or category..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {search && (
          <button
            className="clear-search"
            onClick={() => setSearch("")}
          >
            ×
          </button>
        )}

      </section>


      {/* PRODUCTS HEADER */}

      <div className="products-header">

        <div>
          <span className="section-label">
            INVENTORY
          </span>

          <h2>Products</h2>
        </div>

        <span className="product-count">
          {filteredProducts.length}
          <span>
            {filteredProducts.length === 1
              ? " Product"
              : " Products"}
          </span>
        </span>

      </div>


      {/* PRODUCTS */}

      {filteredProducts.length === 0 ? (

        <div className="empty-state">

          <div className="empty-icon">
            📦
          </div>

          <h3>No products found</h3>

          <p>
            {search
              ? "Try searching with another product name or category."
              : "Start by adding your first product above."}
          </p>

        </div>

      ) : (

        <div className="products-grid">

          {filteredProducts.map((product) => (

            <div
              className="product-card"
              key={product._id}
            >

              <div className="product-card-top">

                <div className="product-avatar">
                  {product.name
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="product-title">

                  <h3>
                    {product.name}
                  </h3>

                  <span className="category-badge">
                    {product.category}
                  </span>

                </div>

              </div>


              <div className="product-info">

                <div className="info-box">

                  <span className="info-label">
                    PRICE
                  </span>

                  <span className="info-value price-value">
                    ₹{product.price}
                  </span>

                </div>


                <div className="info-box">

                  <span className="info-label">
                    STOCK
                  </span>

                  <span className="info-value">
                    {product.stock}
                  </span>

                </div>

              </div>


              <div className="product-actions">

                <button
                  className="edit-btn"
                  onClick={() =>
                    handleEdit(product)
                  }
                >
                  ✎ Edit
                </button>


                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDelete(product._id)
                  }
                >
                  🗑 Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default App;