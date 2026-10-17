import { useEffect, useState } from "react";

const emptyForm = {
  name: "",
  cnic: "",
  cropId: "",
  quantity: "",
  date: "",
  imageBase64: "",
};

export default function BuyerForm({ editingBuyer, onCancelEdit }) {
  const [crops, setCrops] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  function loadData() {
    try {
      setCrops(JSON.parse(localStorage.getItem("agri_crops") || "[]"));
      setBuyers(JSON.parse(localStorage.getItem("agri_buyers") || "[]"));
    } catch {
      setMessage("Unable to load saved records.");
    }
  }

  useEffect(() => {
    loadData();
    window.addEventListener("focus", loadData);
    return () => window.removeEventListener("focus", loadData);
  }, []);

  useEffect(() => {
    if (editingBuyer) {
      setForm({
        name: editingBuyer.name || "",
        cnic: editingBuyer.cnic || "",
        cropId: String(editingBuyer.cropId ?? ""),
        quantity: String(editingBuyer.quantity ?? ""),
        date: editingBuyer.date || "",
        imageBase64: editingBuyer.imageBase64 || "",
      });
      setErrors({});
      setMessage("");
    } else {
      setForm(emptyForm);
    }
  }, [editingBuyer]);

  function updateField(event) {
    const { name, value } = event.target;

    if (name === "cnic") {
      const digits = value.replace(/\D/g, "").slice(0, 13);
      let formatted = digits;

      if (digits.length > 5 && digits.length <= 12) {
        formatted = `${digits.slice(0, 5)}-${digits.slice(5)}`;
      } else if (digits.length > 12) {
        formatted = `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
      }

      setForm((previous) => ({ ...previous, cnic: formatted }));
    } else {
      setForm((previous) => ({ ...previous, [name]: value }));
    }

    setErrors({});
    setMessage("");
  }

  function handleImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setErrors({ imageBase64: "Upload a JPG or PNG image." });
      event.target.value = "";
      return;
    }

    if (file.size > 1024 * 1024) {
      setErrors({ imageBase64: "Image size must not exceed 1 MB." });
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setForm((previous) => ({
        ...previous,
        imageBase64: reader.result,
      }));
      setErrors({});
      setMessage("");
    };

    reader.onerror = () => {
      setErrors({ imageBase64: "Unable to read this image." });
    };

    reader.readAsDataURL(file);
  }

  function getAvailableStock(cropId) {
    const crop = crops.find(
      (item) => String(item.id) === String(cropId)
    );

    if (!crop) return 0;

    const totalStock = Number(
      crop.harvestQty ?? crop.expectedQuantity ?? 0
    );

    const alreadySold = buyers
      .filter(
        (buyer) =>
          String(buyer.cropId) === String(cropId) &&
          String(buyer.id) !== String(editingBuyer?.id)
      )
      .reduce(
        (total, buyer) => total + (Number(buyer.quantity) || 0),
        0
      );

    return Math.max(0, totalStock - alreadySold);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {};
    const cleanName = form.name.trim();
    const cnicDigits = form.cnic.replace(/\D/g, "");
    const quantity = Number(form.quantity);

    const selectedCrop = crops.find(
      (crop) => String(crop.id) === String(form.cropId)
    );

    if (cleanName.length < 3 || !/^[A-Za-z ]+$/.test(cleanName)) {
      newErrors.name = "Enter a name using at least 3 letters.";
    }

    if (cnicDigits.length !== 13) {
      newErrors.cnic = "CNIC must contain exactly 13 digits.";
    } else if (
      buyers.some(
        (buyer) =>
          buyer.cnic.replace(/\D/g, "") === cnicDigits &&
          String(buyer.id) !== String(editingBuyer?.id)
      )
    ) {
      newErrors.cnic = "This CNIC is already registered.";
    }

    if (!form.imageBase64) {
      newErrors.imageBase64 = "Buyer photo is required.";
    }

    if (!selectedCrop) {
      newErrors.cropId = "Please select a crop.";
    }

    if (!form.date) {
      newErrors.date = "Please select a date.";
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      newErrors.quantity = "Enter a quantity greater than zero.";
    } else if (
      selectedCrop &&
      quantity > getAvailableStock(form.cropId)
    ) {
      newErrors.quantity =
        `Available stock is ${getAvailableStock(form.cropId)} kg.`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMessage("");
      return;
    }

    const buyerRecord = {
      id: editingBuyer?.id || `${Date.now()}-${Math.random()}`,
      name: cleanName,
      cnic: form.cnic,
      imageBase64: form.imageBase64,
      cropId: form.cropId,
      quantity,
      date: form.date,
    };

    const updatedBuyers = editingBuyer
      ? buyers.map((buyer) =>
          String(buyer.id) === String(editingBuyer.id)
            ? buyerRecord
            : buyer
        )
      : [...buyers, buyerRecord];

    try {
      localStorage.setItem("agri_buyers", JSON.stringify(updatedBuyers));
      setBuyers(updatedBuyers);
      setForm(emptyForm);
      setErrors({});
      setMessage(
        editingBuyer
          ? "Buyer updated successfully."
          : "Buyer registered successfully."
      );

      const photoInput = document.getElementById("buyer-photo");
      if (photoInput) photoInput.value = "";

      if (editingBuyer) onCancelEdit();
    } catch {
      setMessage("Unable to save this record. Browser storage may be full.");
    }
  }

  return (
    <div className="dashboard-card mb-4">
      <h4 className="section-heading">
        {editingBuyer ? "Edit Buyer" : "Register Buyer"}
      </h4>

      {message && (
        <div className="alert alert-info" role="status">
          {message}
        </div>
      )}

      {crops.length === 0 && (
        <div className="alert alert-warning">
          Add a crop on the Crops page before registering a buyer.
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label" htmlFor="buyer-name">Full Name</label>
          <input
            id="buyer-name"
            className="form-control"
            name="name"
            value={form.name}
            onChange={updateField}
            required
          />
          {errors.name && <div className="text-danger small">{errors.name}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="buyer-cnic">CNIC</label>
          <input
            id="buyer-cnic"
            className="form-control"
            name="cnic"
            value={form.cnic}
            onChange={updateField}
            placeholder="12345-1234567-1"
            inputMode="numeric"
            maxLength={15}
            required
          />
          {errors.cnic && <div className="text-danger small">{errors.cnic}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="buyer-photo">
            Buyer Photo (JPG or PNG, max 1 MB)
          </label>
          <input
            id="buyer-photo"
            className="form-control"
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleImage}
            required={!editingBuyer}
          />
          {errors.imageBase64 && (
            <div className="text-danger small">{errors.imageBase64}</div>
          )}
          {form.imageBase64 && (
            <img
              src={form.imageBase64}
              alt="Buyer preview"
              style={{
                width: 100,
                height: 100,
                objectFit: "cover",
                marginTop: 12,
                borderRadius: 8,
              }}
            />
          )}
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="buyer-crop">Crop</label>
          <select
            id="buyer-crop"
            className="form-select"
            name="cropId"
            value={form.cropId}
            onChange={updateField}
            required
          >
            <option value="">Select a crop</option>
            {crops.map((crop, index) => (
              <option key={crop.id || `${crop.name}-${index}`} value={crop.id}>
                {crop.name}
              </option>
            ))}
          </select>
          {errors.cropId && <div className="text-danger small">{errors.cropId}</div>}
          {form.cropId && (
            <small className="text-muted">
              Available stock: {getAvailableStock(form.cropId)} kg
            </small>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="buyer-quantity">Quantity (kg)</label>
          <input
            id="buyer-quantity"
            className="form-control"
            type="number"
            name="quantity"
            min="1"
            step="any"
            value={form.quantity}
            onChange={updateField}
            required
          />
          {errors.quantity && (
            <div className="text-danger small">{errors.quantity}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="buyer-date">Date</label>
          <input
            id="buyer-date"
            className="form-control"
            type="date"
            name="date"
            value={form.date}
            onChange={updateField}
            required
          />
          {errors.date && <div className="text-danger small">{errors.date}</div>}
        </div>

        <button
          className="btn btn-success me-2"
          type="submit"
          disabled={crops.length === 0}
        >
          {editingBuyer ? "Update Buyer" : "Register Buyer"}
        </button>

        {editingBuyer && (
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => {
              setForm(emptyForm);
              setErrors({});
              setMessage("");
              onCancelEdit();
            }}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}