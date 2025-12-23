import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

function CreateApplication() {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const [formData, setFormData] = useState<any>({
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
    disadvantage: false,
    electricity_acct: "",
    coned_eligibility_key: "",
    project_amount_total: "",
    offered_rebate_amount: "",
    approved_rebate_amount: "",
    total_client_pay_after_rebate: "",
    building_year_built: "",
    building_sqft: "",
    conditioned_sqft: "",
    condenser_models: [],
    acknowledgment_form: false,
    system_total_capacity: false,
    invoice_or_contract: false,
    manual_j: false,
    name_plate_photos: false,
    system_installation_photos: false,
    decommissioning_before_photos_wide_shots: false,
    decommissioning_after_photos_wide_shots: false,
    decommissioning_before_photos_close_up_shots: false,
    decommissioning_after_photos_close_up_shots: false,
    decommissioning_checklist: false,
    notes: "",
  });

  const fade = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  const handleInput = (field: string, value: any) => {
    setFormData((p: any) => ({ ...p, [field]: value }));
  };

  const handleCheckbox = (field: string) => {
    setFormData((p: any) => ({ ...p, [field]: !p[field] }));
  };

  const create = async () => {
    const payload = { ...formData };

    const res = await fetch(`${baseUrl}/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      alert("Application created!");
      navigate(`/applications/${data.payload.id}`);
    }
  };

  return (
    <main className="container-fluid py-4" style={{ maxWidth: "1400px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h1 className="fw-bold" style={{ color: "#0F172A" }}>
          Create New Application
        </h1>

        <div className="d-flex gap-2">
          <Link to="/applications_pages" className="btn btn-outline-secondary">
            Cancel
          </Link>

          <button className="btn btn-primary px-4" onClick={create}>
            Create Application
          </button>
        </div>
      </div>

      <div
        className="row"
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "2rem",
        }}
      >
        <div className="d-flex flex-column gap-4">
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
                <p className="mb-1 text-secondary small">Full Name</p>
                <input
                  className="form-control"
                  value={formData.full_name}
                  onChange={(e) => handleInput("full_name", e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <p className="mb-1 text-secondary small">Email</p>
                <input
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => handleInput("email", e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <p className="mb-1 text-secondary small">Phone</p>
                <input
                  className="form-control"
                  value={formData.phone_number}
                  onChange={(e) => handleInput("phone_number", e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <p className="mb-1 text-secondary small">Address</p>
                <input
                  className="form-control"
                  value={formData.address}
                  onChange={(e) => handleInput("address", e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <p className="mb-1 text-secondary small">Electricity Acct</p>
                <input
                  className="form-control"
                  value={formData.electricity_acct}
                  onChange={(e) =>
                    handleInput("electricity_acct", e.target.value)
                  }
                />
              </div>

              <div className="col-md-6">
                <p className="mb-1 text-secondary small">Eligibility Key</p>
                <input
                  className="form-control"
                  value={formData.coned_eligibility_key}
                  onChange={(e) =>
                    handleInput("coned_eligibility_key", e.target.value)
                  }
                />
              </div>

              <div className="col-md-4">
                <p className="mb-1 text-secondary small">Year Built</p>
                <input
                  className="form-control"
                  value={formData.building_year_built}
                  onChange={(e) =>
                    handleInput("building_year_built", e.target.value)
                  }
                />
              </div>

              <div className="col-md-4">
                <p className="mb-1 text-secondary small">Building Sqft</p>
                <input
                  className="form-control"
                  value={formData.building_sqft}
                  onChange={(e) => handleInput("building_sqft", e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <p className="mb-1 text-secondary small">Conditioned Sqft</p>
                <input
                  className="form-control"
                  value={formData.conditioned_sqft}
                  onChange={(e) =>
                    handleInput("conditioned_sqft", e.target.value)
                  }
                />
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
              Financial Information
            </h4>

            <div className="row g-4">
              <div className="col-md-6">
                <p className="mb-1 text-secondary small">Project Amount</p>
                <input
                  className="form-control"
                  value={formData.project_amount_total}
                  onChange={(e) =>
                    handleInput("project_amount_total", e.target.value)
                  }
                />
              </div>

              <div className="col-md-6">
                <p className="mb-1 text-secondary small">Offered Rebate</p>
                <input
                  className="form-control"
                  value={formData.offered_rebate_amount}
                  onChange={(e) =>
                    handleInput("offered_rebate_amount", e.target.value)
                  }
                />
              </div>

              <div className="col-md-6">
                <p className="mb-1 text-secondary small">Approved Rebate</p>
                <input
                  className="form-control"
                  value={formData.approved_rebate_amount}
                  onChange={(e) =>
                    handleInput("approved_rebate_amount", e.target.value)
                  }
                />
              </div>

              <div className="col-md-6">
                <p className="mb-1 text-secondary small">
                  Client Pays After Rebate
                </p>
                <input
                  className="form-control"
                  value={formData.total_client_pay_after_rebate}
                  onChange={(e) =>
                    handleInput("total_client_pay_after_rebate", e.target.value)
                  }
                />
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
              Notes
            </h4>

            <textarea
              className="form-control"
              rows={4}
              placeholder="Add notes for this application..."
              value={formData.notes}
              onChange={(e) => handleInput("notes", e.target.value)}
            />
          </motion.div>
        </div>

        <div className="d-flex flex-column gap-4">
          <motion.div
            variants={fade}
            initial="hidden"
            animate="show"
            className="card border-0 shadow-lg p-4"
            style={{ borderRadius: "14px" }}
          >
            <h5 className="fw-bold mb-3">Application Steps</h5>

            {[
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
            ].map((field) => (
              <div key={field} className="mb-2 d-flex align-items-center">
                <input
                  type="checkbox"
                  className="form-check-input me-2"
                  checked={formData[field]}
                  onChange={() => handleCheckbox(field)}
                />
                <span className="text-capitalize">
                  {field.replace(/_/g, " ")}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </main>
  );
}

export default CreateApplication;
