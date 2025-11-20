import { motion } from "framer-motion";
import { Link } from "react-router-dom";

type Props = {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
};

export default function CardAction({ title, description, icon, to }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="col-12 col-md-4"
    >
      <Link
        to={to}
        className="text-decoration-none"
        style={{ color: "inherit" }}
      >
        <div className="card h-100 border-0 shadow-sm p-4 rounded-4"
             style={{ background: "#F8FAFC" }}>
          <div className="mb-3" style={{ fontSize: "2.4rem" }}>
            {icon}
          </div>
          <h3 className="h5 fw-bold mb-2">{title}</h3>
          <p className="text-secondary mb-0">{description}</p>
        </div>
      </Link>
    </motion.div>
  );
}
