
import { FaTools } from "react-icons/fa";

type UnderConstructionProps = {
  title?: string;
  message?: string;
};

function UnderConstruction({
  title = "Page Under Construction",
  message = "This page is currently under construction. Please check back later for future updates.",
}: UnderConstructionProps) {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "70vh" }}
    >
      <div
        className="card shadow-lg border-0 text-center p-5"
        style={{ maxWidth: "520px", borderRadius: "16px" }}
      >
        <div className="mb-3">
          <FaTools size={48} className="text-warning" />
        </div>

        <h2 className="fw-bold mb-3">{title}</h2>

        <p className="text-secondary">{message}</p>

        <p className="small text-muted mt-4">
          🚧 We’re actively working on this feature.
        </p>
      </div>
    </div>
  );
}

export default UnderConstruction;
