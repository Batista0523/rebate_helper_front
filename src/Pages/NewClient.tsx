// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// type Payload = {
//   full_name: string;
//   email?: string | null;
//   phone_number?: string | null;
//   address?: string | null;
//   disadvantage?: boolean;
//   electricity_acct?: string | null;
//   coned_eligibility_key?: string | null;
//   project_amount_total?: number | null;
//   offered_rebate_amount?: number | null;
//   approved_rebate_amount?: number | null;
//   total_client_pay_after_rebate?: number | null;
//   building_year_built?: number | null;
//   building_sqft?: number | null;
//   conditioned_sqft?: number | null;
//   condenser_models?: string[];
// };

// function NewClient() {
//   const baseUrl = import.meta.env.VITE_BASE_URL as string;
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string>("");

//   const [form, setForm] = useState({
//     full_name: "",
//     email: "",
//     phone_number: "",
//     address: "",
//     disadvantage: false,
//     electricity_acct: "",
//     coned_eligibility_key: "",
//     project_amount_total: "",
//     offered_rebate_amount: "",
//     approved_rebate_amount: "",
//     total_client_pay_after_rebate: "",
//     building_year_built: "",
//     building_sqft: "",
//     conditioned_sqft: "",
//   });

//   const [condenserModels, setCondenserModels] = useState<string[]>([""]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { id, value, type, checked } = e.target;
//     setForm((prev) => ({ ...prev, [id]: type === "checkbox" ? checked : value }));
//   };

//   const handleModelChange = (i: number, value: string) => {
//     setCondenserModels((prev) => {
//       const copy = [...prev];
//       copy[i] = value;
//       return copy;
//     });
//   };

//   const addModel = () => setCondenserModels((prev) => [...prev, ""]);
//   const removeModel = (i: number) =>
//     setCondenserModels((prev) => prev.filter((_, idx) => idx !== i));

//   const toNumberOrNull = (v: string) => {
//     if (v === "" || v == null) return null;
//     const n = Number(v);
//     return isNaN(n) ? null : n;
//     };

//   const submit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError("");
//     if (!form.full_name.trim()) {
//       setError("Full name is required.");
//       return;
//     }

//     const payload: Payload = {
//       full_name: form.full_name.trim(),
//       email: form.email.trim() || null,
//       phone_number: form.phone_number.trim() || null,
//       address: form.address.trim() || null,
//       disadvantage: !!form.disadvantage,
//       electricity_acct: form.electricity_acct.trim() || null,
//       coned_eligibility_key: form.coned_eligibility_key.trim() || null,
//       project_amount_total: toNumberOrNull(form.project_amount_total),
//       offered_rebate_amount: toNumberOrNull(form.offered_rebate_amount),
//       approved_rebate_amount: toNumberOrNull(form.approved_rebate_amount),
//       total_client_pay_after_rebate: toNumberOrNull(form.total_client_pay_after_rebate),
//       building_year_built: toNumberOrNull(form.building_year_built),
//       building_sqft: toNumberOrNull(form.building_sqft),
//       conditioned_sqft: toNumberOrNull(form.conditioned_sqft),
//       condenser_models: condenserModels.map((m) => m.trim()).filter(Boolean),
//     };

//     try {
//       setLoading(true);
//       const res = await fetch(`${baseUrl}/client`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();
//       if (!res.ok || !data?.success) {
//         throw new Error(data?.error || "Error creating client");
//       }
//       navigate("/clients");
//     } catch (err: any) {
//       setError(err?.message || "Internal error creating client");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="container py-4">
//       <div className="d-flex align-items-center justify-content-between mb-3">
//         <div>
//           <h1 className="h4 mb-1">New client</h1>
//           <div className="text-secondary small">Create a client profile and baseline amounts.</div>
//         </div>
//         <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
//           Back
//         </button>
//       </div>

//       {error && (
//         <div className="alert alert-danger d-flex align-items-center" role="alert">
//           <span className="me-2">⚠️</span>
//           <span>{error}</span>
//         </div>
//       )}

//       <form className="card border-0 shadow-sm" onSubmit={submit}>
//         <div className="card-body p-3 p-md-4">
//           <div className="row g-3">
//             <div className="col-12 col-md-6">
//               <label htmlFor="full_name" className="form-label">Full name *</label>
//               <input id="full_name" className="form-control" value={form.full_name} onChange={handleChange} required />
//             </div>
//             <div className="col-12 col-md-3">
//               <label htmlFor="email" className="form-label">Email</label>
//               <input id="email" type="email" className="form-control" value={form.email} onChange={handleChange} />
//             </div>
//             <div className="col-12 col-md-3">
//               <label htmlFor="phone_number" className="form-label">Phone</label>
//               <input id="phone_number" className="form-control" value={form.phone_number} onChange={handleChange} />
//             </div>

//             <div className="col-12">
//               <label htmlFor="address" className="form-label">Address</label>
//               <input id="address" className="form-control" value={form.address} onChange={handleChange} />
//             </div>

//             <div className="col-12 col-md-3">
//               <label htmlFor="electricity_acct" className="form-label">Electricity acct</label>
//               <input id="electricity_acct" className="form-control" value={form.electricity_acct} onChange={handleChange} />
//             </div>
//             <div className="col-12 col-md-3">
//               <label htmlFor="coned_eligibility_key" className="form-label">ConEd eligibility key</label>
//               <input id="coned_eligibility_key" className="form-control" value={form.coned_eligibility_key} onChange={handleChange} />
//             </div>
//             <div className="col-12 col-md-3 d-flex align-items-end">
//               <div className="form-check">
//                 <input id="disadvantage" type="checkbox" className="form-check-input" checked={form.disadvantage} onChange={handleChange} />
//                 <label htmlFor="disadvantage" className="form-check-label ms-2">Disadvantage</label>
//               </div>
//             </div>

//             <div className="col-12 col-md-3">
//               <label htmlFor="project_amount_total" className="form-label">Project amount ($)</label>
//               <input id="project_amount_total" inputMode="decimal" className="form-control" value={form.project_amount_total} onChange={handleChange} />
//             </div>
//             <div className="col-12 col-md-3">
//               <label htmlFor="offered_rebate_amount" className="form-label">Offered rebate ($)</label>
//               <input id="offered_rebate_amount" inputMode="decimal" className="form-control" value={form.offered_rebate_amount} onChange={handleChange} />
//             </div>
//             <div className="col-12 col-md-3">
//               <label htmlFor="approved_rebate_amount" className="form-label">Approved rebate ($)</label>
//               <input id="approved_rebate_amount" inputMode="decimal" className="form-control" value={form.approved_rebate_amount} onChange={handleChange} />
//             </div>
//             <div className="col-12 col-md-3">
//               <label htmlFor="total_client_pay_after_rebate" className="form-label">Client pays after rebate ($)</label>
//               <input id="total_client_pay_after_rebate" inputMode="decimal" className="form-control" value={form.total_client_pay_after_rebate} onChange={handleChange} />
//             </div>

//             <div className="col-12 col-md-3">
//               <label htmlFor="building_year_built" className="form-label">Year built</label>
//               <input id="building_year_built" inputMode="numeric" className="form-control" value={form.building_year_built} onChange={handleChange} />
//             </div>
//             <div className="col-12 col-md-3">
//               <label htmlFor="building_sqft" className="form-label">Building sqft</label>
//               <input id="building_sqft" inputMode="numeric" className="form-control" value={form.building_sqft} onChange={handleChange} />
//             </div>
//             <div className="col-12 col-md-3">
//               <label htmlFor="conditioned_sqft" className="form-label">Conditioned sqft</label>
//               <input id="conditioned_sqft" inputMode="numeric" className="form-control" value={form.conditioned_sqft} onChange={handleChange} />
//             </div>

//             <div className="col-12">
//               <div className="d-flex align-items-center justify-content-between">
//                 <label className="form-label m-0">Condenser models</label>
//                 <button type="button" className="btn btn-sm btn-outline-primary" onClick={addModel}>
//                   Add another
//                 </button>
//               </div>
//               {condenserModels.map((m, i) => (
//                 <div className="input-group mb-2" key={i}>
//                   <input
//                     className="form-control"
//                     placeholder="e.g. MXZ-2C36HMZ"
//                     value={m}
//                     onChange={(e) => handleModelChange(i, e.target.value)}
//                   />
//                   <button
//                     type="button"
//                     className="btn btn-outline-danger"
//                     onClick={() => removeModel(i)}
//                     disabled={condenserModels.length === 1}
//                   >
//                     Remove
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="card-footer d-flex justify-content-end gap-2">
//           <button
//             type="button"
//             className="btn btn-outline-secondary"
//             onClick={() => navigate("/clients")}
//             disabled={loading}
//           >
//             Cancel
//           </button>
//           <button type="submit" className="btn btn-primary" disabled={loading}>
//             {loading ? (
//               <>
//                 <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
//                 Saving…
//               </>
//             ) : (
//               "Create client"
//             )}
//           </button>
//         </div>
//       </form>
//     </main>
//   );
// }

// export default NewClient;
