import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function OneApplication() {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const [app, setApp] = useState<any>(null);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [newNote, setNewNote] = useState("");

  const [formData, setFormData] = useState<any>({});
  const [steps, setSteps] = useState<any>({});
  const [notes, setNotes] = useState<any[]>([]);

  const fade = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${baseUrl}/applications/${id}`);
        const data = await res.json();

        if (!data.success) return setError("Application not found");

        setApp(data.payload);
        setFormData(data.payload);

        setNotes(data.payload.notes ? JSON.parse(data.payload.notes) : []);

        const s = {
          acknowledgment_form: data.payload.acknowledgment_form,
          system_total_capacity: data.payload.system_total_capacity,
          invoice_or_contract: data.payload.invoice_or_contract,
          manual_j: data.payload.manual_j,
          name_plate_photos: data.payload.name_plate_photos,
          system_installation_photos: data.payload.system_installation_photos,
          decommissioning_before_photos_wide_shots:
            data.payload.decommissioning_before_photos_wide_shots,
          decommissioning_after_photos_wide_shots:
            data.payload.decommissioning_after_photos_wide_shots,
          decommissioning_before_photos_close_up_shots:
            data.payload.decommissioning_before_photos_close_up_shots,
          decommissioning_after_photos_close_up_shots:
            data.payload.decommissioning_after_photos_close_up_shots,
          decommissioning_checklist: data.payload.decommissioning_checklist,
        };

        setSteps(s);
      } catch {
        setError("Error loading application");
      }
    };

    load();
  }, []);

  if (error)
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );

  if (!app)
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );

  const offered = Number(app.offered_rebate_amount || 0);
  const approved = Number(app.approved_rebate_amount || 0);
  const delta = approved - offered;

  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const deltaStatus =
    delta < 0
      ? {
          text: `Deficit ${currency.format(Math.abs(delta))}`,
          color: "#E74C3C",
        }
      : delta > 0
      ? { text: `Client owes ${currency.format(delta)}`, color: "#F1C40F" }
      : { text: "Balanced", color: "#2ECC71" };

  const stepValues = Object.values(steps);
  const complete = stepValues.filter(Boolean).length;
  const total = stepValues.length;
  const progress = Math.round((complete / total) * 100);

  const handleInput = (field: string, value: any) =>
    setFormData((p: any) => ({ ...p, [field]: value }));

  const toggleStep = (field: string) =>
    setSteps((p: any) => ({ ...p, [field]: !p[field] }));

  const saveAll = async (overrideNotes?: any[]) => {
    const body = {
      ...formData,
      ...steps,
      notes: JSON.stringify(overrideNotes ?? notes),
    };

    const res = await fetch(`${baseUrl}/applications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data.success) {
      setApp(data.payload);
      setFormData(data.payload);
      setNotes(data.payload.notes ? JSON.parse(data.payload.notes) : []);
      setEditMode(false);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;

    const entry = {
      text: newNote.trim(),
      date: new Date().toISOString(),
    };

    const updated = [entry, ...notes];

    setNotes(updated);
    setNewNote("");

    await saveAll(updated);
  };

  const deleteApplication = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?"
    );
    if (!confirmDelete) return;

    await fetch(`${baseUrl}/applications/${id}`, {
      method: "DELETE",
    });

    navigate("/applications_pages");
  };

  return (
    <main className="container-fluid py-4" style={{ maxWidth: "1400px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          {!editMode ? (
            <>
              <h1 className="fw-bold mb-1" style={{ color: "#0F172A" }}>
                {app.full_name}
              </h1>
              <div className="text-secondary">{app.address}</div>
            </>
          ) : (
            <>
              <input
                className="form-control form-control-lg mb-2"
                value={formData.full_name}
                onChange={(e) => handleInput("full_name", e.target.value)}
              />
              <input
                className="form-control"
                value={formData.address}
                onChange={(e) => handleInput("address", e.target.value)}
              />
            </>
          )}
        </div>

        <div className="d-flex gap-2">
          <Link to="/applications_pages" className="btn btn-outline-secondary">
            ← Back
          </Link>

          {!editMode ? (
            <button
              className="btn btn-primary px-4"
              onClick={() => setEditMode(true)}
            >
              Edit
            </button>
          ) : (
            <>
              <button
                className="btn btn-success px-4"
                onClick={() => saveAll()}
              >
                Save
              </button>
              <button
                className="btn btn-outline-danger px-4"
                onClick={() => {
                  setFormData(app);
                  setEditMode(false);
                }}
              >
                Cancel
              </button>
            </>
          )}

          <button className="btn btn-danger px-4" onClick={deleteApplication}>
            Delete
          </button>
        </div>
      </div>

      {/* GRID LAYOUT SUPER PROFESIONAL */}
      <div
        className="row"
        style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}
      >
        {/* LEFT GRID: FINANCIAL + CLIENT + NOTES */}
        <div className="d-flex flex-column gap-4">
          <motion.div
            variants={fade}
            initial="hidden"
            animate="show"
            className="card border-0 shadow-lg p-4"
            style={{ borderRadius: "14px" }}
          >
            <h4 className="fw-bold mb-3" style={{ color: "#0F172A" }}>
              Financial Summary
            </h4>

            <div className="p-4 rounded" style={{ background: "#F8FAFC" }}>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-secondary">Offered</span>
                {!editMode ? (
                  <strong>{currency.format(offered)}</strong>
                ) : (
                  <input
                    className="form-control w-50 text-end"
                    value={formData.offered_rebate_amount}
                    onChange={(e) =>
                      handleInput("offered_rebate_amount", e.target.value)
                    }
                  />
                )}
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span className="text-secondary">Approved</span>
                {!editMode ? (
                  <strong>{currency.format(approved)}</strong>
                ) : (
                  <input
                    className="form-control w-50 text-end"
                    value={formData.approved_rebate_amount}
                    onChange={(e) =>
                      handleInput("approved_rebate_amount", e.target.value)
                    }
                  />
                )}
              </div>

              <div
                className="rounded text-white mt-4 text-center fw-semibold py-3"
                style={{ background: deltaStatus.color, fontSize: "1.1rem" }}
              >
                {deltaStatus.text}
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fade}
            initial="hidden"
            animate="show"
            className="card border-0 shadow-lg p-4"
            style={{ borderRadius: "14px" }}
          >
            <h4 className="fw-bold mb-3" style={{ color: "#0F172A" }}>
              Client Information
            </h4>

            <div className="row g-4">
              <div className="col-md-6">
                <p className="mb-1 text-secondary small">Email</p>
                {!editMode ? (
                  <p className="fw-semibold">{app.email || "—"}</p>
                ) : (
                  <input
                    className="form-control"
                    value={formData.email}
                    onChange={(e) => handleInput("email", e.target.value)}
                  />
                )}
              </div>

              <div className="col-md-6">
                <p className="mb-1 text-secondary small">Phone</p>
                {!editMode ? (
                  <p className="fw-semibold">{app.phone_number || "—"}</p>
                ) : (
                  <input
                    className="form-control"
                    value={formData.phone_number}
                    onChange={(e) =>
                      handleInput("phone_number", e.target.value)
                    }
                  />
                )}
              </div>

              <div className="col-md-6">
                <p className="mb-1 text-secondary small">Electricity Acct</p>
                {!editMode ? (
                  <p className="fw-semibold">{app.electricity_acct || "—"}</p>
                ) : (
                  <input
                    className="form-control"
                    value={formData.electricity_acct}
                    onChange={(e) =>
                      handleInput("electricity_acct", e.target.value)
                    }
                  />
                )}
              </div>

              <div className="col-md-6">
                <p className="mb-1 text-secondary small">Eligibility Key</p>
                {!editMode ? (
                  <p className="fw-semibold">
                    {app.coned_eligibility_key || "—"}
                  </p>
                ) : (
                  <input
                    className="form-control"
                    value={formData.coned_eligibility_key}
                    onChange={(e) =>
                      handleInput("coned_eligibility_key", e.target.value)
                    }
                  />
                )}
              </div>

              <div className="col-md-4">
                <p className="mb-1 text-secondary small">Year Built</p>
                {!editMode ? (
                  <p className="fw-semibold">
                    {app.building_year_built || "—"}
                  </p>
                ) : (
                  <input
                    className="form-control"
                    value={formData.building_year_built}
                    onChange={(e) =>
                      handleInput("building_year_built", e.target.value)
                    }
                  />
                )}
              </div>

              <div className="col-md-4">
                <p className="mb-1 text-secondary small">Building Sqft</p>
                {!editMode ? (
                  <p className="fw-semibold">{app.building_sqft || "—"}</p>
                ) : (
                  <input
                    className="form-control"
                    value={formData.building_sqft}
                    onChange={(e) =>
                      handleInput("building_sqft", e.target.value)
                    }
                  />
                )}
              </div>

              <div className="col-md-4">
                <p className="mb-1 text-secondary small">Conditioned Sqft</p>
                {!editMode ? (
                  <p className="fw-semibold">{app.conditioned_sqft || "—"}</p>
                ) : (
                  <input
                    className="form-control"
                    value={formData.conditioned_sqft}
                    onChange={(e) =>
                      handleInput("conditioned_sqft", e.target.value)
                    }
                  />
                )}
              </div>
            </div>
          </motion.div>

          {/* NOTES SECTION – NOW HERE ABOVE SIDEBAR NOT BELOW BOOLEAN */}
          <motion.div
            variants={fade}
            initial="hidden"
            animate="show"
            className="card border-0 shadow-lg p-4"
            style={{ borderRadius: "14px" }}
          >
            <h4 className="fw-bold mb-3" style={{ color: "#0F172A" }}>
              Notes
            </h4>

            <textarea
              className="form-control mb-3"
              rows={3}
              placeholder="Add a note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />

            <button
              className="btn btn-outline-primary w-100 mb-3"
              onClick={addNote}
            >
              + Add Note
            </button>

            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              {notes.length === 0 ? (
                <p className="text-secondary fst-italic">No notes yet.</p>
              ) : (
                notes.map((n, i) => (
                  <div key={i} className="mb-3 pb-2 border-bottom">
                    <div className="small text-secondary">
                      {new Date(n.date).toLocaleString()}
                    </div>
                    <div className="fw-semibold">{n.text}</div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        <div className="d-flex flex-column gap-4">
          <motion.div
            variants={fade}
            initial="hidden"
            animate="show"
            className="card border-0 shadow-lg p-4 text-center"
            style={{ borderRadius: "14px" }}
          >
            <h5 className="fw-bold mb-3">Progress</h5>

            <div
              className="position-relative mx-auto mb-3"
              style={{ width: "160px", height: "160px" }}
            >
              <svg width="160" height="160">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#E5E7EB"
                  strokeWidth="12"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#16A34A"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={440}
                  strokeDashoffset={440 - (440 * progress) / 100}
                  strokeLinecap="round"
                  style={{ transition: "0.5s" }}
                />
              </svg>
              <div
                className="position-absolute top-50 start-50 translate-middle fw-bold"
                style={{ fontSize: "1.6rem" }}
              >
                {progress}%
              </div>
            </div>

            <div className="small text-secondary">
              {complete} / {total} steps completed
            </div>
          </motion.div>

          <motion.div
            variants={fade}
            initial="hidden"
            animate="show"
            className="card border-0 shadow-lg p-4"
            style={{ borderRadius: "14px" }}
          >
            <h5 className="fw-bold mb-3">Required Steps</h5>

            {Object.keys(steps).map((key) => (
              <div key={key} className="mb-2 d-flex align-items-center">
                <input
                  type="checkbox"
                  className="form-check-input me-2"
                  checked={steps[key]}
                  onChange={() => toggleStep(key)}
                />
                <span className="text-capitalize">
                  {key.replace(/_/g, " ")}
                </span>
              </div>
            ))}

            <button className="btn btn-success px-4" onClick={() => saveAll()}>
              Save
            </button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

export default OneApplication;
