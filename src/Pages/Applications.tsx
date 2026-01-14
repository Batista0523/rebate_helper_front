import { useEffect, useState, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { Link } from "react-router-dom";

const STEP_FIELDS = [
  "acknowledgment_form",
  "system_total_capacity",
  "invoice_or_contract",
  "manual_j",
  "name_plate_photos",
  "system_installation_photos",
  "decommissioning_before_photos_wide_shots",
  "decommissioning_after_photos_wide_shots",
  "decommissioning_before_photos_close_up_shots",
  "decommissioning_after_photos_close_up_shots",
  "decommissioning_checklist",
] as const;

type Application = {
  id: number;
  full_name: string;
  address?: string | null;
  offered_rebate_amount?: number | null;
  approved_rebate_amount?: number | null;
  created_at?: string | null;
  acknowledgment_form?: boolean;
  system_total_capacity?: boolean;
  invoice_or_contract?: boolean;
  manual_j?: boolean;
  name_plate_photos?: boolean;
  system_installation_photos?: boolean;
  decommissioning_before_photos_wide_shots?: boolean;
  decommissioning_after_photos_wide_shots?: boolean;
  decommissioning_before_photos_close_up_shots?: boolean;
  decommissioning_after_photos_close_up_shots?: boolean;
  decommissioning_checklist?: boolean;
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

const getProgress = (app: Application) => {
  const total = STEP_FIELDS.length;
  const completed = STEP_FIELDS.filter((f) => Boolean(app[f])).length;
  return Math.round((completed / total) * 100);
};

function ApplicationsPage() {
  const baseUrl = import.meta.env.VITE_BASE_URL as string;

  const [applications, setApplications] = useState<Application[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number | "all">(currentYear);
  const [selected, setSelected] = useState<number[]>([]);

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

  const years = useMemo(() => {
    const appYears = applications
      .map((a) => (a.created_at ? Number(a.created_at.slice(0, 4)) : null))
      .filter(Boolean) as number[];

    const minYear = appYears.length ? Math.min(...appYears) : currentYear;
    const maxYear = Math.max(currentYear, ...appYears);

    const allYears: (number | "all")[] = ["all"];
    for (let y = maxYear; y >= minYear; y--) allYears.push(y);
    return allYears;
  }, [applications, currentYear]);

  const appsByYear = useMemo(() => {
    if (selectedYear === "all") return applications;
    return applications.filter(
      (a) => a.created_at && Number(a.created_at.slice(0, 4)) === selectedYear
    );
  }, [applications, selectedYear]);

  const filteredApps = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return appsByYear;
    return appsByYear.filter((a) =>
      `${a.full_name} ${a.address ?? ""}`.toLowerCase().includes(q)
    );
  }, [appsByYear, query]);

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

  const handleDuplicate = async (id: number) => {
    const confirmDuplicate = window.confirm("Duplicate this application?");
    if (!confirmDuplicate) return;

    try {
      const res = await fetch(`${baseUrl}/applications/${id}/duplicate`, {
        method: "POST",
      });

      const data = await res.json();

      if (data.success) {
        setApplications((prev) => [data.payload, ...prev]);
      } else {
        alert("Failed to duplicate application");
      }
    } catch {
      alert("Server error duplicating application");
    }
  };


const deleteSelected = async () => {
  const code = prompt("Enter delete code");
  if (!code) return;

  const res = await fetch(`${baseUrl}/applications/bulk-delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids: selected, code }),
  });

  const data = await res.json();
  if (!data.success) {
    alert("Invalid code or error");
    return;
  }

  setSelected([]);
  window.location.reload();
};


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
{selected.length > 0 && (
  <div className="mb-3 d-flex gap-2">
    <button className="btn btn-danger" onClick={deleteSelected}>
      Delete selected ({selected.length})
    </button>
  </div>
)}

        <motion.div
          className="d-flex flex-column flex-md-row align-items-md-end gap-3"
          variants={rise}
        >
          <Link to="/newApplication" className="btn btn-outline-primary">
            New Application
          </Link>

          <select
            className="form-select"
            value={selectedYear}
            onChange={(e) =>
              setSelectedYear(
                e.target.value === "all" ? "all" : Number(e.target.value)
              )
            }
            style={{ minWidth: 140 }}
          >
            {years.map((y) =>
              y === "all" ? (
                <option key="all" value="all">
                  All time
                </option>
              ) : (
                <option key={y} value={y}>
                  {y}
                </option>
              )
            )}
          </select>

          <input
            type="text"
            className="form-control"
            placeholder="Search by name or address..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ minWidth: 250 }}
          />
        </motion.div>
      </div>

      {ytdCount === 0 ? (
        <div className="alert alert-warning">
          No rebate submitted{" "}
          {selectedYear === "all" ? "for all time" : `in ${selectedYear}`}.
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
                  <div className="small text-secondary">Total Offered</div>
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
                  <div className="small text-secondary">Total Approved</div>
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
                  <div className="small text-secondary">Difference</div>
                  <div
                    className={`h4 ${
                      ytdDelta < 0 ? "text-danger" : "text-success"
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
              const progress = getProgress(a);
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
                          <span className="text-secondary small">Eligible</span>
                          <strong>
                            {currency.format(toMoney(a.approved_rebate_amount))}
                          </strong>
                        </div>

                        <div className="mt-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span className="small text-secondary">
                              Progress
                            </span>
                            <span className="small fw-semibold">
                              {progress}%
                            </span>
                          </div>
                          <div className="progress" style={{ height: 8 }}>
                            <div
                              className={`progress-bar ${
                                progress === 100
                                  ? "bg-success"
                                  : progress >= 50
                                  ? "bg-primary"
                                  : "bg-warning"
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDuplicate(a.id);
                              }}
                            >
                              Duplicate
                            </button>

                            <span className="small text-secondary">
                              {getProgress(a)}%
                            </span>
                          </div>
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
