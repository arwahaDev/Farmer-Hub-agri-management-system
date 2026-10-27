import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const crops = useSelector((state) => state.crops ?? []);
  const buyers = useSelector((state) => state.buyers ?? []);
  const inventory = useSelector((state) => state.inventory ?? []);
  const tasks = useSelector((state) => state.tasks ?? []);
  const orders = useSelector((state) => state.orders ?? []);

  const results = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) return [];

    const groups = [
      { label: "Crops", path: "/crops", items: crops },
      { label: "Buyers", path: "/buyers", items: buyers },
      { label: "Inventory", path: "/inventory", items: inventory },
      { label: "Tasks", path: "/tasks", items: tasks },
      { label: "Harvest Orders", path: "/harvest-orders", items: orders },
    ];

    return groups.flatMap((group) =>
      (Array.isArray(group.items) ? group.items : [])
        .filter((item) => {
          const searchableText = [
            item.name,
            item.title,
            item.cropName,
            item.buyerName,
            item.productName,
            item.status,
            item.category,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return searchableText.includes(search);
        })
        .slice(0, 5)
        .map((item, index) => ({
          id: item.id ?? `${group.label}-${index}`,
          title:
            item.name ||
            item.title ||
            item.cropName ||
            item.buyerName ||
            item.productName ||
            `${group.label} record`,
          category: group.label,
          path: group.path,
        }))
    );
  }, [query, crops, buyers, inventory, tasks, orders]);

  function openResult(result) {
    navigate(result.path);
    setQuery("");
    setIsFocused(false);
  }

  return (
    <div className="global-search">
      <span className="search-icon" aria-hidden="true">⌕</span>

      <input
        type="search"
        value={query}
        placeholder="Search crops, buyers, inventory, tasks..."
        aria-label="Search farm records"
        aria-expanded={isFocused && query.trim().length > 0}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 150)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setQuery("");
            setIsFocused(false);
          }

          if (event.key === "Enter" && results.length > 0) {
            openResult(results[0]);
          }
        }}
      />

      {query.trim() && isFocused && (
        <div className="search-results">
          {results.length > 0 ? (
            results.map((result) => (
              <button
                type="button"
                className="search-result-item"
                key={`${result.category}-${result.id}`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => openResult(result)}
              >
                <span>
                  <strong>{result.title}</strong>
                  <small>{result.category}</small>
                </span>
                <span aria-hidden="true">→</span>
              </button>
            ))
          ) : (
            <p className="search-empty">
              No matching records found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}