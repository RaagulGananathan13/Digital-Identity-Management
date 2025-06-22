import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

const DigitalIdentityList = () => {
  const [identities, setIdentities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    axios
      .get("http://localhost:3000/tmf-api/digitalIdentityManagement/v4/digitalIdentity?fields=id,href,nickname,status")
      .then((response) => setIdentities(response.data))
      .catch((error) => console.error("Error fetching identities:", error));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this digital identity?")) {
      axios
        .delete(`http://localhost:3000/tmf-api/digitalIdentityManagement/v4/digitalIdentity/${id}`)
        .then(() => setIdentities(identities.filter((identity) => identity.id !== id)))
        .catch((error) => console.error("Error deleting identity:", error));
    }
  };

  const filteredIdentities = identities.filter((identity) => {
    const matchesSearch =
      identity.nickname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      identity.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || identity.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-bold dark:text-white text-gray-800">Digital Identities</h2>

      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by ID or Nickname..."
          className="md:w-1/3 p-3 rounded dark:bg-gray-700 bg-gray-200 dark:text-white text-gray-800 border dark:border-purple-500 border-purple-300 focus:outline-none focus:ring-2 focus:dark:ring-purple-600 focus:ring-purple-400 transition-all"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="md:w-1/4 p-3 rounded dark:bg-gray-700 bg-gray-200 dark:text-white text-gray-800 border dark:border-purple-500 border-purple-300 focus:outline-none focus:ring-2 focus:dark:ring-purple-600 focus:ring-purple-400 transition-all"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="archived">Archived</option>
          <option value="unknown">Unknown</option>
          <option value="pending">Pending</option>
        </select>
        <Link
          to="/digital-identities/new"
          className="bg-purple-600 dark:bg-purple-700 text-white px-4 py-3 rounded flex items-center hover:bg-purple-700 dark:hover:bg-purple-800 transition-all"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add New
        </Link>
      </div>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="overflow-x-auto"
        >
          <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
            <thead>
              <tr className="bg-purple-100 dark:bg-purple-900 text-gray-800 dark:text-white text-left">
                <th className="p-4">Nickname / ID</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIdentities.map((identity, index) => (
                <motion.tr
                  key={identity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="p-4">
                    <Link
                      to={`/digital-identities/${identity.id}`}
                      className="text-purple-700 dark:text-purple-400 hover:underline"
                    >
                      {identity.nickname || identity.id}
                    </Link>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100 capitalize">
                      {identity.status}
                    </span>
                  </td>
                  <td className="p-4 text-center space-x-4">
                    <Link
                      to={`/digital-identities/${identity.id}`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-1" /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(identity.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-1" /> Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
              {filteredIdentities.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No identities found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DigitalIdentityList;
