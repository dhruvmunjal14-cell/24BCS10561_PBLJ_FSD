import { useState, useEffect, useMemo } from "react";

const MOCK_ASSETS = [
  {
    id: "1",
    name: "Apple Inc.",
    category: "Stocks",
    quantity: 15,
    currentPrice: 185.5,
  },
  {
    id: "2",
    name: "US Treasury 10Y",
    category: "Bonds",
    quantity: 50,
    currentPrice: 98.2,
  },
  {
    id: "3",
    name: "NVIDIA Corp.",
    category: "Stocks",
    quantity: 10,
    currentPrice: 875.0,
  },
  {
    id: "4",
    name: "Vanguard S&P 500 ETF",
    category: "ETFs",
    quantity: 25,
    currentPrice: 460.1,
  },
  {
    id: "5",
    name: "Corporate High Yield Bond",
    category: "Bonds",
    quantity: 30,
    currentPrice: 102.4,
  },
];

// ==========================================
// 1. CHILD COMPONENTS (PROPS PASSING)
// ==========================================

const FilterBar = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  currency,
  setCurrency,
}) => {
  return (
    <div className="filter-bar">
      {/* TODO: Bind input value and onChange to searchTerm/setSearchTerm */}
      <input
        data-testid="search-input"
        placeholder="Filter by asset name..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      />

      {/* TODO: Bind select value and onChange to selectedCategory/setSelectedCategory */}
      <select
        data-testid="category-select"
        value={selectedCategory}
        onChange={(e) => {
          setSelectedCategory(e.target.value);
        }}
      >
        <option value="All">All Categories</option>
        <option value="Stocks">Stocks</option>
        <option value="Bonds">Bonds</option>
        <option value="ETFs">ETFs</option>
      </select>

      {/* TODO: Toggle currency state between 'USD' ($) and 'EUR' (€) */}
      <button
        data-testid="currency-toggle"
        value={currency}
        onClick={() => {
          currency === "USD" ? setCurrency("EURO") : setCurrency("USD");
        }}
      >
        Currency: {currency}
      </button>
    </div>
  );
};

const PortfolioMetrics = ({ totalValue, currency, assetCount }) => {
  // TODO: Determine currency symbol ('$' for USD, '€' for EUR)
  const symbol = currency === "USD" ? "$" : "€";

  return (
    <div className="metrics-card" data-testid="portfolio-metrics">
      <h2>Portfolio Summary</h2>
      <p data-testid="total-value">
        Total Value: {symbol}
        {totalValue.toFixed(2)}
      </p>
      <p data-testid="asset-count">Matching Assets: {assetCount}</p>
    </div>
  );
};

const AssetTable = ({ filteredAssets, currency }) => {
  // TODO: Use the passed 'assets' prop instead of an empty array
  const assets = filteredAssets;
  const symbol = currency === "USD" ? "$" : "€";

  return (
    <table data-testid="asset-table">
      <thead>
        <tr>
          <th>Asset Name</th>
          <th>Category</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {assets.map((asset) => (
          <tr key={asset.id} data-testid={`asset-row-${asset.id}`}>
            <td>{asset.name}</td>
            <td>{asset.category}</td>
            <td>{asset.quantity}</td>
            <td>
              {symbol}
              {asset.currentPrice.toFixed(2)}
            </td>
            <td>
              {symbol}
              {(asset.quantity * asset.currentPrice).toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// ==========================================
// 2. PARENT DASHBOARD COMPONENT
// ==========================================

export default function App() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currency, setCurrency] = useState("USD");

  // TODO: useEffect 1 - Fetch data after 600ms, setAssets with MOCK_ASSETS, setLoading to false
  useEffect(() => {
    setTimeout(() => {
      setAssets(MOCK_ASSETS);
      setLoading(false);
    }, 600);
  }, []);

  // TODO: useMemo - Calculate filteredAssets and totalValue.
  // IMPORTANT: Add this exact line inside your useMemo callback for grading:
  // window.analyticsMemoCount = (window.analyticsMemoCount || 0) + 1;
  const { filteredAssets, totalValue } = useMemo(() => {
    const res = assets.filter((item) => {
      if (item.name.toLowerCase().includes(searchTerm.toLowerCase()))
        if (selectedCategory === "All" || selectedCategory === item.category)
          return item;
    });

    const total = res.reduce(
      (sum, curr) => sum + curr.quantity * curr.currentPrice,
      0,
    );

    window.analyticsMemoCount = (window.analyticsMemoCount || 0) + 1;

    return { filteredAssets: res, totalValue: total };
  }, [assets, searchTerm, selectedCategory]);

  // TODO: useEffect 2 - Update document.title to "Portfolio - Total: ${totalValue.toFixed(2)}"
  useEffect(() => {
    document.title = "Portfolio - Total: " + totalValue.toFixed(2);
  }, [filteredAssets]);

  return (
    <div className="app-container" data-testid="app-container">
      <h1>Investment Analytics Dashboard</h1>

      {/* TODO: Pass necessary props to FilterBar */}
      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        currency={currency}
        setCurrency={setCurrency}
      />

      {loading ? (
        <p data-testid="loading-text">Loading portfolio data...</p>
      ) : (
        <>
          {/* TODO: Pass props to PortfolioMetrics */}
          <PortfolioMetrics
            totalValue={totalValue}
            currency={currency}
            assetCount={filteredAssets.length}
          />

          {/* TODO: Pass props to AssetTable */}
          <AssetTable filteredAssets={filteredAssets} currency={currency} />
        </>
      )}
    </div>
  );
}