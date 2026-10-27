import { useEffect, useState } from "react";

export default function BuyerTable({onEdit}) {
  const [buyers, setBuyers] = useState([]);
  const [search, setSearch] = useState("");
  const [cropNames, setCropNames] = useState({});
  const [message, setMessage] = useState("");

  function loadBuyers() {
    try {
      const savedBuyers = JSON.parse(
        localStorage.getItem("agri_buyers") || "[]"
      );
      const savedCrops = JSON.parse(
        localStorage.getItem("agri_crops") || "[]"
      );

      setBuyers(Array.isArray(savedBuyers) ? savedBuyers : []);

      const names = {};
      savedCrops.forEach((crop) => {
        names[String(crop.id)] = crop.name;
      });
      setCropNames(names);
    } catch {
      setMessage("Unable to load saved buyer records.");
    }
  }

  useEffect(() => {
    loadBuyers();
    window.addEventListener("focus", loadBuyers);

    return () => {
      window.removeEventListener("focus", loadBuyers);
    };
  }, []);

  function deleteBuyer(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this buyer?"
    );

    if (!confirmed) return;

    const updatedBuyers = buyers.filter(
      (buyer) => buyer.id !== id
    );

    try {
      localStorage.setItem(
        "agri_buyers",
        JSON.stringify(updatedBuyers)
      );
      setBuyers(updatedBuyers);
      setMessage("Buyer deleted successfully.");
    } catch {
      setMessage("Unable to delete this buyer.");
    }
  }

  const filteredBuyers = buyers.filter((buyer) => {
    const term = search.trim().toLowerCase();

    return (
      (buyer.name || "").toLowerCase().includes(term) ||
      (buyer.cnic || "").includes(term)
    );
  });

  return (
    <div className="dashboard-card mb-4">
      <h4 className="section-heading">Buyer Records</h4>

      {message && (
        <div className="alert alert-info">{message}</div>
      )}

      <div className="mb-3">
        <label className="form-label" htmlFor="buyer-search">
          Search by name or CNIC
        </label>
        <input
          id="buyer-search"
          className="form-control"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Enter buyer name or CNIC"
        />
      </div>

      {filteredBuyers.length === 0 ? (
        <div className="alert alert-info mb-0">
          {buyers.length === 0
            ? "No buyers registered yet."
            : "No buyers match your search."}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>CNIC</th>
                <th>Crop</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredBuyers.map((buyer, index) => (
                <tr key={buyer.id || `${buyer.cnic}-${index}`}>
                  <td>
                    {buyer.imageBase64 ? (
                      <img
                        src={buyer.imageBase64}
                        alt={buyer.name}
                        width="45"
                        height="45"
                        style={{
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      "No photo"
                    )}
                  </td>
                  <td>{buyer.name}</td>
                  <td>{buyer.cnic}</td>
                  <td>
                    {cropNames[String(buyer.cropId)] || "Unknown crop"}
                  </td>
                  <td>{buyer.quantity} kg</td>
                  <td>{buyer.date}</td>
                  <td>
                    <button
  type="button"
  className="btn btn-sm btn-outline-primary me-2"
  onClick={() => onEdit(buyer)}
>
  Edit
</button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteBuyer(buyer.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}