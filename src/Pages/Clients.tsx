import { useEffect, useState, useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
type Client = {
  id: number;
  full_name: string;
  email?: string | null;
  phone_number?: string | null;
  address?: string | null;
  disadvantage?: boolean;
  electricity_acct?: string | null;
  coned_eligibility_key?: string | null;
  project_amount_total?: number | string | null;
  offered_rebate_amount?: number | string | null;
  approved_rebate_amount?: number | string | null;
  total_client_pay_after_rebate?: number | string | null;
  building_year_built?: number | string | null;
  building_sqft?: number | string | null;
  conditioned_sqft?: number | string | null;
  condenser_models?: string[];
  created_at?: string | null;
};

const page: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.06 },
  },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.2, 0.8, 0.2, 1] },
  },
};

const popCard: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 16 },
  },
};

function Clients() {
  const baseUrl = import.meta.env.VITE_BASE_URL as string;
  const [clients, setClients] = useState<Client[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${baseUrl}/client`);
        const data = await res.json();
        if (data.success) setClients(data.payload as Client[]);
        else {
          setError("Error fetching data");
          console.error(data);
        }
      } catch (e) {
        setError("Internal error fetching data");
        console.error(e);
      }
    };
    fetchData();
  }, [baseUrl]);

  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  const currentYear = new Date().getFullYear();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) => {
      const fields = [
        c.full_name,
        c.email ?? "",
        c.address ?? "",
        c.phone_number ?? "",
        c.electricity_acct ?? "",
        c.coned_eligibility_key ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return fields.includes(q);
    });
  }, [clients, query]);

  let ytdOffered = 0;
  let ytdApproved = 0;
  let ytdCount = 0;

  for (const c of filtered) {
    if (!c?.created_at) continue;
    const dt = new Date(c.created_at);
    if (isNaN(dt.getTime()) || dt.getFullYear() !== currentYear) continue;

    const offered =
      c.offered_rebate_amount == null ? 0 : Number(c.offered_rebate_amount);
    const approved =
      c.approved_rebate_amount == null ? 0 : Number(c.approved_rebate_amount);

    if (!isNaN(offered)) ytdOffered += offered;
    if (!isNaN(approved)) ytdApproved += approved;
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
      <div className="row g-3 align-items-end mb-2">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h1 className="h4 mb-1">Client Portfolio</h1>
            <div className="text-secondary small">
              YTD totals reflect the current search. Refine to focus on a
              segment.
            </div>
          </div>
          <div className="d-flex gap-2">
            <Link to="/newClients" className="btn btn-primary">
              New client
            </Link>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <motion.div variants={rise} className="input-group">
            <span className="input-group-text">Search</span>
            <input
              className="form-control"
              placeholder="Name, email, address, acct, key..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              className="btn btn-outline-secondary"
              onClick={() => setQuery("")}
              disabled={!query}
            >
              Clear
            </button>
          </motion.div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <motion.div variants={popCard} className="card border-0 shadow-sm">
            <div className="card-body p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <div className="small text-secondary">YTD Offered (sum)</div>
                <span className="badge text-bg-primary">Offered</span>
              </div>
              <div className="h3 fw-semibold m-0">
                {currency.format(ytdOffered)}
              </div>
            </div>
            <div className="card-footer bg-body-tertiary text-center small text-secondary">
              {ytdCount} client{ytdCount === 1 ? "" : "s"} in {currentYear}
            </div>
          </motion.div>
        </div>

        <div className="col-12 col-md-4">
          <motion.div variants={popCard} className="card border-0 shadow-sm">
            <div className="card-body p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <div className="small text-secondary">YTD Approved (sum)</div>
                <span className="badge text-bg-success">Approved</span>
              </div>
              <div className="h3 fw-semibold m-0">
                {currency.format(ytdApproved)}
              </div>
            </div>
            <div className="card-footer bg-body-tertiary text-center small text-secondary">
              Aggregated approvals
            </div>
          </motion.div>
        </div>

        <div className="col-12 col-md-4">
          <motion.div variants={popCard} className="card border-0 shadow-sm">
            <div className="card-body p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <div className="small text-secondary">
                  YTD Δ (Approved − Offered)
                </div>
                <span
                  className={
                    "badge " +
                    (ytdDelta > 0
                      ? "text-bg-success"
                      : ytdDelta < 0
                      ? "text-bg-danger"
                      : "text-bg-secondary")
                  }
                >
                  {ytdDelta > 0 ? "Surplus" : ytdDelta < 0 ? "Deficit" : "Even"}
                </span>
              </div>
              <div
                className={
                  "h3 fw-semibold m-0 " +
                  (ytdDelta > 0
                    ? "text-success"
                    : ytdDelta < 0
                    ? "text-danger"
                    : "text-secondary")
                }
              >
                {ytdDelta > 0 ? "+" : ""}
                {currency.format(ytdDelta)}
              </div>
            </div>
            <div className="card-footer bg-body-tertiary text-center small text-secondary">
              Margin indicator
            </div>
          </motion.div>
        </div>
      </div>

      {error && (
        <motion.div
          variants={rise}
          className="alert alert-danger d-flex align-items-center"
          role="alert"
        >
          <span className="me-2">⚠️</span>
          <span>{error}</span>
        </motion.div>
      )}

      <div className="row g-3">
        {filtered.map((client) => {
          const offered =
            client.offered_rebate_amount == null
              ? null
              : Number(client.offered_rebate_amount);
          const approved =
            client.approved_rebate_amount == null
              ? null
              : Number(client.approved_rebate_amount);
          const delta =
            offered !== null && approved !== null ? approved - offered : null;

          const initials = client.full_name
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();

          return (
            <div className="col-12 col-md-6 col-lg-4" key={client.id}>
              <motion.div
                variants={popCard}
                className="card h-100 border-0 shadow-sm"
              >
                <div className="card-body">
                  <div className="d-flex align-items-start justify-content-between mb-3">
                    <div className="d-flex align-items-center">
                      <div
                        className="rounded-circle bg-primary-subtle text-primary-emphasis d-flex align-items-center justify-content-center me-3"
                        style={{ width: 44, height: 44, fontWeight: 700 }}
                      >
                        {initials}
                      </div>
                      <div>
                        <div className="fw-semibold">{client.full_name}</div>
                        <div className="small text-secondary">
                          {client.address || "No address"}
                        </div>
                      </div>
                    </div>
                    {client.disadvantage ? (
                      <span className="badge text-bg-warning">
                        Disadvantage
                      </span>
                    ) : (
                      <span className="badge text-bg-secondary">Standard</span>
                    )}
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-12 d-flex justify-content-between">
                      <span className="text-secondary">Offered</span>
                      <strong>
                        {offered === null || isNaN(offered)
                          ? "—"
                          : currency.format(offered)}
                      </strong>
                    </div>
                    <div className="col-12 d-flex justify-content-between">
                      <span className="text-secondary">Approved</span>
                      <strong>
                        {approved === null || isNaN(approved)
                          ? "—"
                          : currency.format(approved)}
                      </strong>
                    </div>
                    <div className="col-12 d-flex justify-content-between align-items-center">
                      <span className="text-secondary">Δ</span>
                      {delta === null || isNaN(delta) ? (
                        <span className="badge text-bg-secondary">—</span>
                      ) : delta > 0 ? (
                        <span className="badge text-bg-success">
                          +{currency.format(delta)}
                        </span>
                      ) : delta < 0 ? (
                        <span className="badge text-bg-danger">
                          {currency.format(delta)}
                        </span>
                      ) : (
                        <span className="badge text-bg-secondary">0</span>
                      )}
                    </div>
                  </div>

                  <div className="small text-secondary mb-2">
                    {client.electricity_acct ? (
                      <>
                        Acct:{" "}
                        <span className="text-body">
                          {client.electricity_acct}
                        </span>
                      </>
                    ) : (
                      "Acct: —"
                    )}
                    {client.coned_eligibility_key ? (
                      <>
                        {" "}
                        • Key:{" "}
                        <span className="text-body">
                          {client.coned_eligibility_key}
                        </span>
                      </>
                    ) : (
                      " • Key: —"
                    )}
                  </div>

                  <ul className="list-unstyled small mb-0">
                    <li>
                      <strong>Email:</strong> {client.email || "—"}
                    </li>
                    <li>
                      <strong>Phone:</strong> {client.phone_number || "—"}
                    </li>
                    <li>
                      <strong>Building sqft</strong> {client.building_sqft || "—"}
                    </li>
                    <li>
                      <strong>Condensed sqft</strong> {client.conditioned_sqft || "—"}
                    </li>
                    <li>
                      <strong>Building year</strong> {client.building_year_built || "—"}
                    </li>
                  </ul>
                </div>

                {client.condenser_models &&
                  client.condenser_models.length > 0 && (
                    <div className="card-footer bg-body-tertiary">
                      <div className="small text-secondary mb-1">
                        Condenser models
                      </div>
                      <div className="d-flex flex-wrap gap-1">
                        {client.condenser_models.map((m, i) => (
                          <span
                            className="badge text-bg-light text-dark"
                            key={i}
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </motion.div>
            </div>
          );
        })}

        {filtered.length === 0 && !error && (
          <div className="col-12">
            <motion.div variants={rise} className="alert alert-secondary">
              No clients match your search.
            </motion.div>
          </div>
        )}
      </div>
    </motion.main>
  );
}

export default Clients;
