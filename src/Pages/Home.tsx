import { motion } from "framer-motion";
import CardAction from "../Components/CardActions";
import { FaPlusCircle, FaListAlt, FaRegLightbulb } from "react-icons/fa";

const page = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

function Home() {
  return (
    <motion.main
      variants={page}
      initial="hidden"
      animate="show"
      className="container py-5"
      style={{ maxWidth: "1100px" }}
    >
      <div className="text-center mb-5">
        <h1 className="fw-bold" style={{ color: "#0F172A" }}>
          Welcome to Clean Heat Portal
        </h1>
        <p className="text-secondary fs-5">
          Manage your applications with speed, structure, and clarity.
        </p>
      </div>

      <div className="row g-4">

        <CardAction
          title="Create Application"
          description="Start a new ConEd Clean Heat rebate application."
          icon={<FaPlusCircle className="text-primary" />}
          to="/newApplication"
        />

        <CardAction
          title="Instructions"
          description="Step-by-step guides, rules, and requirements."
          icon={<FaRegLightbulb className="text-warning" />}
          to="/instructions"
        />

        <CardAction
          title="View Applications"
          description="See, track, and manage all existing applications."
          icon={<FaListAlt className="text-success" />}
          to="/applications_pages"
        />

      </div>
    </motion.main>
  );
}

export default Home;
