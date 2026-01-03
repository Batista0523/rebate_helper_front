import { useEffect, useState, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { Link } from "react-router-dom";

type Application = {
  id: number;
  full_name: string;
  address?: string | null;
  offered_rebate_amount?: number | null;
  approved_rebate_amount?: number | null;
  created_at?: string | null;
};

const page: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.05 },
  },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const popCard: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 110, damping: 14 },
  },
};

const toMoney = (v: number | string | null | undefined): number =>
  v == null ? 0 : Number(v);

function ApplicationsPage() {
  const baseUrl = import.meta.env.VITE_BASE_URL as string;
  const [applications, setApplications] = useState<Application[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await fetch(`${baseUrl}/applications`);
        const data = await res.json();
        if (data.success) setApplications(data.payload);
        else setError("Error fetching applications");
      } catch {
        setError("Internal server error");
      }
    };
    fetchApps();
  }, [baseUrl]);

  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  // Build list of all years, including empty years
  const years = useMemo(() => {
    const appYears = applications
      .map((a) => (a.created_at ? Number(a.created_at.slice(0, 4)) : null))
      .filter(Boolean) as number[];
    const minYear = appYears.length ? Math.min(...appYears) : currentYear;
    const maxYear = Math.max(currentYear, ...appYears);
    const allYears: number[] = [];
    for (let y = maxYear; y >= minYear; y--) allYears.push(y);
    return allYears;
  }, [applications, currentYear]);

  // Filter apps by selected year
  const appsByYear = useMemo(() => {
    return applications.filter(
      (a) => a.created_at && Number(a.created_at.slice(0, 4)) === selectedYear
    );
  }, [applications, selectedYear]);

  // Filter by search query
  const filteredApps = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return appsByYear;
    return appsByYear.filter((a) =>
      `${a.full_name} ${a.address ?? ""}`.toLowerCase().includes(q)
    );
  }, [appsByYear, query]);

  // YTD calculations
  const { ytdOffered, ytdApproved, ytdCount } = useMemo(() => {
    let offered = 0;
    let approved = 0;
    let count = 0;

    for (const a of appsByYear) {
      offered += toMoney(a.offered_rebate_amount);
      approved += toMoney(a.approved_rebate_amount);
      count++;
    }

    return { ytdOffered: offered, ytdApproved: approved, ytdCount: count };
  }, [appsByYear]);

  const ytdDelta = ytdApproved - ytdOffered;

  return (
    <motion.main
      className="container py-5"
      variants={page}
      initial="hidden"
      animate="show"
    >
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
        <div>
          <h1 className="h4 mb-1">Applications</h1>
          <p className="text-secondary small mb-0">
            View applications by client. Click a card for full details.
          </p>
        </div>

        <motion.div
          className="d-flex flex-column flex-md-row align-items-md-end gap-3"
          variants={rise}
        >
          <Link to="/newApplication" style={{ textDecoration: "none" }}>
            <button
              className="btn"
              style={{
                backgroundColor: "#fff",
                color: "#0d6efd",
                border: "1px solid #0d6efd",
                padding: "1.6rem",
                fontSize: "0.95rem",
                fontWeight: 500,
                borderRadius: "0.5rem",
                height: "40px",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                minWidth: "160px",
                justifyContent: "center",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.backgroundColor = "#0d6efd";
                btn.style.color = "#fff";
                btn.style.textDecoration = "none";
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.backgroundColor = "#fff";
                btn.style.color = "#0d6efd";
                btn.style.textDecoration = "none";
              }}
            >
        
              New Application
            </button>
          </Link>

          <select
            className="form-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            style={{ minWidth: 120 }}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <div className="input-group" style={{ maxWidth: 300 }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or address..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ minWidth: 250 }}
            />
          </div>
        </motion.div>
      </div>

      {ytdCount === 0 ? (
        <div className="alert alert-warning">
          No rebate submitted in {selectedYear}.
        </div>
      ) : (
        <>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <motion.div
                variants={popCard}
                className="card shadow-sm border-0"
              >
                <div className="card-body">
                  <div className="small text-secondary">
                    Year-to-Date Offered
                  </div>
                  <div className="h4">{currency.format(ytdOffered)}</div>
                  <div className="small text-secondary">{ytdCount} apps</div>
                </div>
              </motion.div>
            </div>

            <div className="col-md-4">
              <motion.div
                variants={popCard}
                className="card shadow-sm border-0"
              >
                <div className="card-body">
                  <div className="small text-secondary">
                    Year To Date Eligible
                  </div>
                  <div className="h4">{currency.format(ytdApproved)}</div>
                </div>
              </motion.div>
            </div>

            <div className="col-md-4">
              <motion.div
                variants={popCard}
                className="card shadow-sm border-0"
              >
                <div className="card-body">
                  <div className="small text-secondary">
                    Year-to-Date Difference
                  </div>
                  <div
                    className={`h4 ${
                      ytdDelta > 0
                        ? "text-success"
                        : ytdDelta < 0
                        ? "text-danger"
                        : ""
                    }`}
                  >
                    {ytdDelta > 0 ? "+" : ""}
                    {currency.format(ytdDelta)}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="row g-3">
            {filteredApps.map((a) => {
              const initials = a.full_name
                .split(" ")
                .map((p) => p[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              return (
                <div key={a.id} className="col-12 col-md-6 col-lg-4">
                  <Link
                    to={`/applications_pages/${a.id}`}
                    className="text-decoration-none text-dark"
                  >
                    <motion.div
                      variants={popCard}
                      className="card border-0 shadow-sm h-100"
                    >
                      <div className="card-body">
                        <div className="d-flex align-items-center mb-2">
                          <div
                            className="rounded-circle bg-primary-subtle text-primary-emphasis d-flex align-items-center justify-content-center me-3"
                            style={{ width: 46, height: 46, fontWeight: 700 }}
                          >
                            {initials}
                          </div>
                          <div>
                            <div className="fw-semibold">{a.full_name}</div>
                            <div className="small text-secondary">
                              {a.address || "No address"}
                            </div>
                          </div>
                        </div>

                        <div className="d-flex justify-content-between">
                          <span className="text-secondary small">Offered</span>
                          <strong>
                            {currency.format(toMoney(a.offered_rebate_amount))}
                          </strong>
                        </div>

                        <div className="d-flex justify-content-between">
                          <span className="text-secondary small">Approved</span>
                          <strong>
                            {currency.format(toMoney(a.approved_rebate_amount))}
                          </strong>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </div>
              );
            })}
          </div>
        </>
      )}

      {error && <div className="alert alert-danger">{error}</div>}
    </motion.main>
  );
}

export default ApplicationsPage;
