import { useEffect, useState, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { Link } from "react-router-dom";

type Application = {
  id: number;
  full_name: string;
  address?: string | null;
  offered_rebate_amount?: number | string | null;
  approved_rebate_amount?: number | string | null;
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
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
};

const popCard: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 110, damping: 14 },
  },
};

function ApplicationsPage() {
  const baseUrl = import.meta.env.VITE_BASE_URL as string;
  const [applications, setApplications] = useState<Application[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await fetch(`${baseUrl}/applications`);
        const data = await res.json();
        if (data.success) setApplications(data.payload);
        else setError("Error fetching applications");
      } catch (err) {
        setError("Internal server error");
      }
    };
    fetchApps();
  }, [baseUrl]);

  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  // FILTER
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return applications;
    return applications.filter((a) =>
      `${a.full_name} ${a.address}`.toLowerCase().includes(q)
    );
  }, [applications, query]);

  // YTD CALCULATIONS
  const currentYear = new Date().getFullYear();

  let ytdOffered = 0;
  let ytdApproved = 0;
  let ytdCount = 0;

  for (const a of filtered) {
    if (!a.created_at) continue;
    const dt = new Date(a.created_at);
    if (dt.getFullYear() !== currentYear) continue;

    const offered = a.offered_rebate_amount ? Number(a.offered_rebate_amount) : 0;
    const approved = a.approved_rebate_amount ? Number(a.approved_rebate_amount) : 0;

    ytdOffered += offered;
    ytdApproved += approved;
    ytdCount++;
  }

  const ytdDelta = ytdApproved - ytdOffered;

  return (
    <motion.main
      className="container py-4"
      variants={page}
      initial="hidden"
      animate="show"
    >
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h1 className="h4">Applications</h1>
          <div className="text-secondary small">
            Showing applications by client. Click a card to view full details.
          </div>
        </div>

        <motion.div variants={rise} className="input-group" style={{ maxWidth: 320 }}>
          <span className="input-group-text">Search</span>
          <input
            className="form-control"
            placeholder="Name or address..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </motion.div>
      </div>

      {/* STATS */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <motion.div variants={popCard} className="card shadow-sm border-0">
            <div className="card-body">
              <div className="small text-secondary">YTD Offered</div>
              <div className="h4">{currency.format(ytdOffered)}</div>
              <div className="small text-secondary">{ytdCount} apps</div>
            </div>
          </motion.div>
        </div>

        <div className="col-md-4">
          <motion.div variants={popCard} className="card shadow-sm border-0">
            <div className="card-body">
              <div className="small text-secondary">YTD Eligible</div>
              <div className="h4">{currency.format(ytdApproved)}</div>
            </div>
          </motion.div>
        </div>

        <div className="col-md-4">
          <motion.div variants={popCard} className="card shadow-sm border-0">
            <div className="card-body">
              <div className="small text-secondary">YTD Δ</div>
              <div className={`h4 ${ytdDelta > 0 ? "text-success" : ytdDelta < 0 ? "text-danger" : ""}`}>
                {ytdDelta > 0 ? "+" : ""}
                {currency.format(ytdDelta)}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

   
      {error && <div className="alert alert-danger">{error}</div>}

     
      <div className="row g-3">
        {filtered.map((a) => {
          const initials = a.full_name
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();

          return (
            <div key={a.id} className="col-12 col-md-6 col-lg-4">
              <Link
                to={`/applications/${a.id}`}
                className="text-decoration-none text-dark"
              >
                <motion.div variants={popCard} className="card border-0 shadow-sm h-100">
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
                        {a.offered_rebate_amount
                          ? currency.format(Number(a.offered_rebate_amount))
                          : "—"}
                      </strong>
                    </div>

                    <div className="d-flex justify-content-between">
                      <span className="text-secondary small">Eligible</span>
                      <strong>
                        {a.approved_rebate_amount
                          ? currency.format(Number(a.approved_rebate_amount))
                          : "—"}
                      </strong>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </div>
          );
        })}
      </div>
    </motion.main>
  );
}

export default ApplicationsPage;
