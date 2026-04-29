import { useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE = "http://localhost:8081";

const SERVICE_ICONS = {
  Plumber: "🔧",
  Electrician: "⚡",
  Carpenter: "🪚",
  Painter: "🎨",
  "AC Repair": "❄️",
  default: "🛠️",
};

const SERVICE_DESC = {
  Plumber: "Pipe fitting, leak repair, bathroom fixtures, water tank installation",
  Electrician: "Wiring, switchboard repair, fan/light installation, inverter setup",
  Carpenter: "Furniture repair, door/window fitting, custom woodwork",
  Painter: "Interior & exterior painting, waterproofing, texture work",
  "AC Repair": "AC servicing, gas refill, installation, cooling issues",
  default: "General home services and repairs",
};

const ALL_SERVICES = ["Plumber", "Electrician", "Carpenter", "Painter", "AC Repair"];

// ── STAR RATING ──
function StarRating({ rating }) {
  const filled = Math.round(rating || 0);
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= filled ? "star filled" : "star"}>★</span>
      ))}
      <span className="rating-num">{rating ? Number(rating).toFixed(1) : "N/A"}</span>
    </div>
  );
}

// ── VENDOR DETAIL MODAL ──
function VendorModal({ vendor, onClose }) {
  if (!vendor) return null;
  const icon = SERVICE_ICONS[vendor.serviceType] || SERVICE_ICONS.default;
  const desc = SERVICE_DESC[vendor.serviceType] || SERVICE_DESC.default;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-icon">{icon}</div>
        <h2 className="modal-name">{vendor.name}</h2>
        <span className="tag">{vendor.serviceType}</span>
        <StarRating rating={vendor.rating} />
        <div className="modal-details">
          <div className="detail-row">
            <span className="detail-label">📞 Phone</span>
            <a href={`tel:${vendor.phone}`} className="detail-value phone-link">{vendor.phone}</a>
          </div>
          <div className="detail-row">
            <span className="detail-label">📍 Address</span>
            <span className="detail-value">{vendor.address || "Not provided"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">📮 PIN Code</span>
            <span className="detail-value">{vendor.pinCode}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">🛠️ Services</span>
            <span className="detail-value">{desc}</span>
          </div>
        </div>
        <a
          href={`https://wa.me/91${vendor.phone}`}
          target="_blank"
          rel="noreferrer"
          className="whatsapp-btn"
        >
          💬 WhatsApp
        </a>
        <a href={`tel:${vendor.phone}`} className="call-btn">📞 Call Now</a>
      </div>
    </div>
  );
}

// ── ADD VENDOR FORM ──
function AddVendorForm({ onSuccess, onClose }) {
  const empty = { name: "", serviceType: "", phone: "", pinCode: "", address: "", rating: "" };
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.name || !form.serviceType || !form.phone || !form.pinCode) {
      setMsg("❌ Please fill all required fields.");
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      setMsg("❌ Phone must be exactly 10 digits.");
      return;
    }
    if (!/^\d{6}$/.test(form.pinCode)) {
      setMsg("❌ PIN code must be exactly 6 digits.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/api/vendors`, {
        ...form,
        rating: form.rating ? parseFloat(form.rating) : null,
      });
      setMsg("✅ Vendor added successfully!");
      setForm(empty);
      setTimeout(() => { onSuccess(); onClose(); }, 1200);
    } catch {
      setMsg("❌ Failed to add vendor. Check server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card form-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-name">➕ Add New Vendor</h2>

        <div className="form-grid">
          <div className="form-group">
            <label>Name *</label>
            <input name="name" placeholder="Vendor name" value={form.name} onChange={handle} />
          </div>
          <div className="form-group">
            <label>Service Type *</label>
            <select name="serviceType" value={form.serviceType} onChange={handle}>
              <option value="">Select service</option>
              {ALL_SERVICES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Phone *</label>
            <input name="phone" placeholder="10-digit number" maxLength={10} value={form.phone} onChange={handle} />
          </div>
          <div className="form-group">
            <label>PIN Code *</label>
            <input name="pinCode" placeholder="6-digit PIN" maxLength={6} value={form.pinCode} onChange={handle} />
          </div>
          <div className="form-group full-width">
            <label>Address</label>
            <input name="address" placeholder="Full address" value={form.address} onChange={handle} />
          </div>
          <div className="form-group">
            <label>Rating (1–5)</label>
            <input name="rating" type="number" min="1" max="5" step="0.1" placeholder="e.g. 4.5" value={form.rating} onChange={handle} />
          </div>
        </div>

        {msg && <p className={msg.startsWith("✅") ? "success-msg" : "error"}>{msg}</p>}

        <button className="call-btn submit-btn" onClick={submit} disabled={loading}>
          {loading ? "Adding..." : "Add Vendor"}
        </button>
      </div>
    </div>
  );
}

// ── ADMIN PANEL ──
function AdminPanel({ onClose }) {
  const [allVendors, setAllVendors] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [msg, setMsg] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/search?pinCode=000000`);
      // fetch all by getting common PINs
      const pins = ["413701", "411001"];
      const results = await Promise.all(
        pins.map((p) => axios.get(`${API_BASE}/api/search?pinCode=${p}`))
      );
      const merged = [];
      const seen = new Set();
      results.forEach((r) =>
        r.data.forEach((v) => { if (!seen.has(v.id)) { seen.add(v.id); merged.push(v); } })
      );
      setAllVendors(merged);
      setLoaded(true);
    } catch {
      setMsg("❌ Could not load vendors.");
    } finally {
      setLoading(false);
    }
  };

  const deleteVendor = async (id) => {
    if (!window.confirm("Delete this vendor?")) return;
    try {
      await axios.delete(`${API_BASE}/api/vendors/${id}`);
      setAllVendors((prev) => prev.filter((v) => v.id !== id));
      setMsg("✅ Vendor deleted.");
    } catch {
      setMsg("❌ Delete failed.");
    }
  };

  const startEdit = (v) => {
    setEditId(v.id);
    setEditForm({ ...v });
  };

  const saveEdit = async () => {
    try {
      await axios.put(`${API_BASE}/api/vendors/${editId}`, {
        ...editForm,
        rating: editForm.rating ? parseFloat(editForm.rating) : null,
      });
      setAllVendors((prev) => prev.map((v) => (v.id === editId ? { ...editForm } : v)));
      setEditId(null);
      setMsg("✅ Vendor updated.");
    } catch {
      setMsg("❌ Update failed.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="admin-panel" onClick={(e) => e.stopPropagation()}>
        <div className="admin-header">
          <h2>🛡️ Admin Panel</h2>
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="add-btn" onClick={() => setShowAddForm(true)}>➕ Add Vendor</button>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
        </div>

        {!loaded ? (
          <button className="call-btn" onClick={fetchAll} disabled={loading}>
            {loading ? "Loading..." : "Load All Vendors"}
          </button>
        ) : (
          <>
            {msg && <p className={msg.startsWith("✅") ? "success-msg" : "error"}>{msg}</p>}
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Service</th>
                    <th>Phone</th>
                    <th>PIN</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allVendors.map((v) =>
                    editId === v.id ? (
                      <tr key={v.id} className="edit-row">
                        <td><input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></td>
                        <td>
                          <select value={editForm.serviceType} onChange={(e) => setEditForm({ ...editForm, serviceType: e.target.value })}>
                            {ALL_SERVICES.map((s) => <option key={s}>{s}</option>)}
                          </select>
                        </td>
                        <td><input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} /></td>
                        <td><input value={editForm.pinCode} onChange={(e) => setEditForm({ ...editForm, pinCode: e.target.value })} /></td>
                        <td><input type="number" value={editForm.rating} step="0.1" min="1" max="5" onChange={(e) => setEditForm({ ...editForm, rating: e.target.value })} /></td>
                        <td>
                          <button className="save-btn" onClick={saveEdit}>💾 Save</button>
                          <button className="cancel-btn" onClick={() => setEditId(null)}>Cancel</button>
                        </td>
                      </tr>
                    ) : (
                      <tr key={v.id}>
                        <td>{v.name}</td>
                        <td><span className="tag">{v.serviceType}</span></td>
                        <td>{v.phone}</td>
                        <td>{v.pinCode}</td>
                        <td>⭐ {v.rating ? Number(v.rating).toFixed(1) : "N/A"}</td>
                        <td>
                          <button className="edit-btn" onClick={() => startEdit(v)}>✏️ Edit</button>
                          <button className="delete-btn" onClick={() => deleteVendor(v.id)}>🗑️ Delete</button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {showAddForm && (
          <AddVendorForm
            onSuccess={fetchAll}
            onClose={() => setShowAddForm(false)}
          />
        )}
      </div>
    </div>
  );
}

// ── MAIN APP ──
function App() {
  const [pin, setPin] = useState("");
  const [vendors, setVendors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  const applyFilter = (list, cat, sort) => {
    let result = cat === "All" ? list : list.filter((v) => v.serviceType === cat);
    if (sort === "rating") result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sort === "name") result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    setFiltered(result);
  };

  const search = async () => {
    if (pin.trim() === "") { setError("❌ Please enter a PIN code."); return; }
    if (!/^\d+$/.test(pin)) { setError("❌ Invalid PIN code — only numbers allowed."); return; }
    if (pin.length !== 6) { setError("❌ Invalid PIN code — must be exactly 6 digits."); return; }
    setError("");
    setLoading(true);
    setSearched(false);
    setVendors([]);
    setFiltered([]);
    setCategoryFilter("All");
    setSortBy("default");
    try {
      const res = await axios.get(`${API_BASE}/api/search?pinCode=${pin}`);
      setVendors(res.data);
      setFiltered(res.data);
      setSearched(true);
      if (res.data.length === 0) setError("⚠️ No vendors found for this PIN code.");
    } catch {
      setError("❌ Server error. Make sure Spring Boot is running.");
    } finally {
      setLoading(false);
    }
  };

  const handlePinChange = (e) => {
    const val = e.target.value;
    setPin(val);
    if (val.length > 0 && !/^\d+$/.test(val)) setError("❌ Invalid PIN — only numbers allowed.");
    else if (val.length > 6) setError("❌ Invalid PIN — must be 6 digits.");
    else setError("");
  };

  const handleCategory = (cat) => {
    setCategoryFilter(cat);
    applyFilter(vendors, cat, sortBy);
  };

  const handleSort = (s) => {
    setSortBy(s);
    applyFilter(vendors, categoryFilter, s);
  };

  // get available categories from search results
  const availableCategories = ["All", ...new Set(vendors.map((v) => v.serviceType))];

  return (
    <div className="app">
      {/* TOP BAR */}
      <div className="top-bar">
        <button className="admin-toggle" onClick={() => setShowAdmin(true)}>
          🛡️ Admin Panel
        </button>
      </div>

      {/* HEADER */}
      <div className="header">
        <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" alt="logo" />
        <h1>Vendor Finder</h1>
      </div>
      <p className="subtitle">Find trusted local service providers in your area</p>

      {/* SEARCH */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Enter 6-digit PIN code"
          value={pin}
          onChange={handlePinChange}
          onKeyDown={(e) => e.key === "Enter" && search()}
          maxLength={6}
          className={error ? "input-error" : ""}
        />
        <button onClick={search} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
        <button className="add-vendor-btn" onClick={() => setShowAddForm(true)}>
          ➕ Add Vendor
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {/* FILTER & SORT BAR */}
      {searched && vendors.length > 0 && (
        <div className="filter-bar">
          <div className="category-chips">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                className={`chip ${categoryFilter === cat ? "chip-active" : ""}`}
                onClick={() => handleCategory(cat)}
              >
                {cat !== "All" ? SERVICE_ICONS[cat] : "🔍"} {cat}
              </button>
            ))}
          </div>
          <select className="sort-select" value={sortBy} onChange={(e) => handleSort(e.target.value)}>
            <option value="default">Sort: Default</option>
            <option value="rating">Sort: Top Rated</option>
            <option value="name">Sort: A → Z</option>
          </select>
        </div>
      )}

      {searched && vendors.length > 0 && (
        <p className="results-count">
          Showing <strong>{filtered.length}</strong> of <strong>{vendors.length}</strong> vendors in PIN <strong>{pin}</strong>
          <span className="click-hint"> — click any card for details</span>
        </p>
      )}

      {/* CARDS */}
      <div className="cards">
        {filtered.map((v, i) => (
          <div
            className="card"
            key={v.id}
            onClick={() => setSelectedVendor(v)}
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div className="card-icon">{SERVICE_ICONS[v.serviceType] || SERVICE_ICONS.default}</div>
            <div className="card-body">
              <h2>{v.name}</h2>
              <span className="tag">{v.serviceType}</span>
              <p>📞 {v.phone}</p>
              {v.address && <p>📍 {v.address}</p>}
              <div className="rating">⭐ {v.rating ? Number(v.rating).toFixed(1) : "N/A"}</div>
            </div>
            <div className="card-arrow">›</div>
          </div>
        ))}
      </div>

      {/* MODALS */}
      <VendorModal vendor={selectedVendor} onClose={() => setSelectedVendor(null)} />
      {showAddForm && <AddVendorForm onSuccess={search} onClose={() => setShowAddForm(false)} />}
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
    </div>
  );
}

export default App;
