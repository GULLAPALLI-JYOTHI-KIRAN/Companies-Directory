import  { useEffect, useMemo, useState } from "react";


// Utility: fetch companies from /companies.json
async function fetchCompanies() {
  const res = await fetch("/companies.json");
  if (!res.ok) throw new Error(`Failed to load companies: ${res.status}`);
  return res.json();
}

export default function CompaniesDirectory() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & UI state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); // 👈 New debounced value
  const [location, setLocation] = useState("All");
  const [industry, setIndustry] = useState("All");
  const [sort, setSort] = useState("name-asc");

  // Pagination
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  // Fetch companies
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchCompanies()
      .then((data) => {
        if (!mounted) return;
        setCompanies(data);
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || "Unknown error");
        setLoading(false);
      });
    return () => (mounted = false);
  }, []);

  // 🧠 Debounce effect: wait 300ms after typing stops
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Derived filter lists
  const locations = useMemo(
    () => ["All", ...Array.from(new Set(companies.map((c) => c.location))).sort()],
    [companies]
  );
  const industries = useMemo(
    () => ["All", ...Array.from(new Set(companies.map((c) => c.industry))).sort()],
    [companies]
  );

  // Filtering + searching + sorting
  const filtered = useMemo(() => {
    let result = companies.slice();
    if (debouncedSearch.trim()) { // 👈 use debouncedSearch here
      const q = debouncedSearch.trim().toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q)) ||
          (c.industry && c.industry.toLowerCase().includes(q))
      );
    }
    if (location !== "All") result = result.filter((c) => c.location === location);
    if (industry !== "All") result = result.filter((c) => c.industry === industry);

    if (sort === "name-asc") result.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "name-desc") result.sort((a, b) => b.name.localeCompare(a.name));
    if (sort === "employees-asc") result.sort((a, b) => a.employees - b.employees);
    if (sort === "employees-desc") result.sort((a, b) => b.employees - a.employees);

    return result;
  }, [companies, debouncedSearch, location, industry, sort]); // 👈 depends on debouncedSearch

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1); // Reset to page 1 on filter changes
  }, [debouncedSearch, location, industry, sort]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-pulse text-2xl font-semibold">Loading companies…</div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-red-600">
          <h3 className="text-xl font-semibold">Error loading companies</h3>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold">Companies Directory</h1>
        <p className="text-gray-600 mt-1">
          Browse, search and filter companies.
        </p>
      </header>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 grid gap-3 grid-cols-1 md:grid-cols-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, industry, description..."
          className="border px-3 py-2 rounded-md w-full"
        />

        <select value={location} onChange={(e) => setLocation(e.target.value)} className="border px-3 py-2 rounded-md">
          {locations.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="border px-3 py-2 rounded-md">
          {industries.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)} className="border px-3 py-2 rounded-md">
          <option value="name-asc">Name: A → Z</option>
          <option value="name-desc">Name: Z → A</option>
          <option value="employees-desc">Employees: High → Low</option>
          <option value="employees-asc">Employees: Low → High</option>
        </select>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          Showing <strong>{filtered.length}</strong> results
        </div>
        <div className="text-sm text-gray-600">
          Page <strong>{page}</strong> of {totalPages}
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {paginated.map((c) => (
          <article key={c.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-md flex items-center justify-center bg-gray-100 text-xl font-semibold">
                {c.name[0]}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{c.name}</h3>
                <p className="text-sm text-gray-500">
                  {c.industry} • {c.location}
                </p>
              </div>
              <div className="text-sm text-gray-500 text-right">
                <div>{c.employees.toLocaleString()} employees</div>
                <a className="text-blue-600 text-sm" href={c.website} target="_blank" rel="noreferrer">
                  Website
                </a>
              </div>
            </div>
            {c.description && <p className="mt-3 text-sm text-gray-700">{c.description}</p>}
          </article>
        ))}
      </div>

      {/* Pagination controls */}
      <footer className="mt-6 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <div className="text-sm text-gray-600">Results per page: {PAGE_SIZE}</div>
      </footer>
    </div>
  );
}
