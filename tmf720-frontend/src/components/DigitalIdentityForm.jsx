import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";

const DigitalIdentityForm = () => {
  const [formData, setFormData] = useState({
    id: "",
    nickname: "",
    status: "active",
    credential: [{ id: "", state: "active", "@type": "LoginPasswordCredential", login: "", password: "" }],
    individualIdentified: { id: "", "@referredType": "Individual" },
    "@type": "DigitalIdentity",
    "@schemaLocation": "https://example.com/tmf-api/digitalIdentityManagement/v4/schema/DigitalIdentity",
    error: "",
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  useEffect(() => {
    let isMounted = true;
    if (isEdit) {
      console.log(`Fetching identity with id: ${id}`);
      axios.get(`http://localhost:3000/tmf-api/digitalIdentityManagement/v4/digitalIdentity/${id}`)
        .then(response => {
          if (isMounted) {
            const data = response.data;
            console.log("Fetched data:", data);
            setFormData({
              id: data.id || uuidv4(),
              nickname: data.nickname || "",
              status: data.status || "active",
              credential: data.credential && data.credential.length > 0
                ? [{ 
                    id: data.credential[0].id || "",
                    state: data.credential[0].state || "active",
                    "@type": data.credential[0]["@type"] || "LoginPasswordCredential",
                    login: data.credential[0].login || "",
                    password: data.credential[0].password || "",
                  }]
                : [{ id: "", state: "active", "@type": "LoginPasswordCredential", login: "", password: "" }],
              individualIdentified: data.individualIdentified || { id: uuidv4(), "@referredType": "Individual" },
              "@type": data["@type"] || "DigitalIdentity",
              "@schemaLocation": data["@schemaLocation"] || "https://example.com/tmf-api/digitalIdentityManagement/v4/schema/DigitalIdentity",
              error: "",
            });
          }
        })
        .catch(error => {
          console.error("Error fetching identity:", error);
          if (isMounted) {
            setFormData(prev => ({ ...prev, error: "Failed to fetch identity details. Check console for details." }));
          }
        });
    } else {
      setFormData(prev => ({
        ...prev,
        id: uuidv4(),
        individualIdentified: { id: uuidv4(), "@referredType": "Individual" },
        error: "",
      }));
    }
    return () => { isMounted = false };
  }, [isEdit, id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.credential[0].id || !formData.credential[0].login || !formData.credential[0].password) {
      setFormData(prev => ({ ...prev, error: "Credential ID, Login, and Password are required." }));
      return;
    }

    const url = isEdit
      ? `http://localhost:3000/tmf-api/digitalIdentityManagement/v4/digitalIdentity/${id}`
      : `http://localhost:3000/tmf-api/digitalIdentityManagement/v4/digitalIdentity`;
    const method = isEdit ? "patch" : "post";

    const payload = { ...formData };
    if (isEdit) {
      delete payload.id;
      delete payload.href;
    }
    payload.credential = [formData.credential[0]];

    axios[method](url, payload)
      .then(() => navigate("/digital-identities"))
      .catch(error => {
        console.error("Error saving identity:", error);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || "Failed to save identity. Check console for details.";
        setFormData(prev => ({ ...prev, error: errorMessage }));
      });
  };

  return (
    <motion.div 
      className="max-w-2xl mx-auto p-6 dark:bg-gray-800 bg-gray-100 rounded-lg shadow-xl dark:border-purple-500 border-purple-300"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold dark:text-white text-gray-800 mb-6 text-center">{isEdit ? "Edit" : "Add"} Digital Identity</h2>
      {formData.error && <div className="dark:text-red-400 text-red-600 mb-4 text-center">{formData.error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div 
          className="p-4 dark:bg-gray-700 bg-gray-200 rounded"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <input
            type="text"
            value={formData.id}
            onChange={e => setFormData({ ...formData, id: e.target.value, error: "" })}
            placeholder="ID (auto-generated for new)"
            className="w-full p-3 rounded dark:bg-gray-600 bg-gray-300 dark:text-white text-gray-800 border dark:border-purple-500 border-purple-300 focus:outline-none focus:ring-2 focus:dark:ring-purple-600 focus:ring-purple-400 transition-all"
            disabled={isEdit}
          />
        </motion.div>
        <motion.div 
          className="p-4 dark:bg-gray-700 bg-gray-200 rounded"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <input
            type="text"
            value={formData.nickname}
            onChange={e => setFormData({ ...formData, nickname: e.target.value, error: "" })}
            placeholder="Nickname"
            className="w-full p-3 rounded dark:bg-gray-600 bg-gray-300 dark:text-white text-gray-800 border dark:border-purple-500 border-purple-300 focus:outline-none focus:ring-2 focus:dark:ring-purple-600 focus:ring-purple-400 transition-all"
          />
        </motion.div>
        <motion.div 
          className="p-4 dark:bg-gray-700 bg-gray-200 rounded"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <select
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value, error: "" })}
            className="w-full p-3 rounded dark:bg-gray-600 bg-gray-300 dark:text-white text-gray-800 border dark:border-purple-500 border-purple-300 focus:outline-none focus:ring-2 focus:dark:ring-purple-600 focus:ring-purple-400 transition-all"
          >
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="archived">Archived</option>
            <option value="unknown">Unknown</option>
            <option value="pending">Pending</option>
          </select>
        </motion.div>
        <motion.div 
          className="p-4 dark:bg-gray-700 bg-gray-200 rounded"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <input
            type="text"
            value={formData.credential[0].id}
            onChange={e => setFormData({
              ...formData,
              credential: [{ ...formData.credential[0], id: e.target.value }],
              error: ""
            })}
            placeholder="Credential ID"
            className="w-full p-3 rounded dark:bg-gray-600 bg-gray-300 dark:text-white text-gray-800 border dark:border-purple-500 border-purple-300 focus:outline-none focus:ring-2 focus:dark:ring-purple-600 focus:ring-purple-400 transition-all"
            required
          />
        </motion.div>
        <motion.div 
          className="p-4 dark:bg-gray-700 bg-gray-200 rounded"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <input
            type="text"
            value={formData.credential[0].login}
            onChange={e => setFormData({
              ...formData,
              credential: [{ ...formData.credential[0], login: e.target.value }],
              error: ""
            })}
            placeholder="Login"
            className="w-full p-3 rounded dark:bg-gray-600 bg-gray-300 dark:text-white text-gray-800 border dark:border-purple-500 border-purple-300 focus:outline-none focus:ring-2 focus:dark:ring-purple-600 focus:ring-purple-400 transition-all"
            required
          />
        </motion.div>
        <motion.div 
          className="p-4 dark:bg-gray-700 bg-gray-200 rounded"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <input
            type="password"
            value={formData.credential[0].password}
            onChange={e => setFormData({
              ...formData,
              credential: [{ ...formData.credential[0], password: e.target.value }],
              error: ""
            })}
            placeholder="Password"
            className="w-full p-3 rounded dark:bg-gray-600 bg-gray-300 dark:text-white text-gray-800 border dark:border-purple-500 border-purple-300 focus:outline-none focus:ring-2 focus:dark:ring-purple-600 focus:ring-purple-400 transition-all"
            required
          />
        </motion.div>
        <motion.div 
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <button 
            type="submit" 
            className="w-full dark:bg-purple-600 bg-purple-500 text-white p-3 rounded hover:dark:bg-purple-700 hover:bg-purple-600 transition-all duration-300"
          >
            {isEdit ? "Update" : "Save"}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default DigitalIdentityForm;