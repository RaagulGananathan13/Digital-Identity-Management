import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const DigitalIdentityForm = () => {
  const [formData, setFormData] = useState({
    nickname: "",
    status: "active",
    credential: [{ id: "", state: "active", "@type": "LoginPasswordCredential", login: "", password: "" }],
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      axios.get(`http://localhost:3000/tmf-api/digitalIdentityManagement/v4/digitalIdentity/${id}`)
        .then(response => {
          const data = response.data;
          setFormData({
            nickname: data.nickname || "",
            status: data.status || "active",
            credential: data.credential && data.credential.length > 0
              ? [{ ...data.credential[0], "@type": data.credential[0]["@type"] || "LoginPasswordCredential" }]
              : [{ id: "", state: "active", "@type": "LoginPasswordCredential", login: "", password: "" }],
          });
        })
        .catch(error => console.error("Error fetching identity:", error));
    }
  }, [isEdit, id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = isEdit
      ? `http://localhost:3000/tmf-api/digitalIdentityManagement/v4/digitalIdentity/${id}`
      : `http://localhost:3000/tmf-api/digitalIdentityManagement/v4/digitalIdentity`;
    const method = isEdit ? "patch" : "post";

    axios[method](url, { ...formData, "@type": "DigitalIdentity" })
      .then(() => navigate("/digital-identities"))
      .catch(error => console.error("Error saving identity:", error));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{isEdit ? "Edit" : "Add"} Digital Identity</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={formData.nickname}
          onChange={e => setFormData({ ...formData, nickname: e.target.value })}
          placeholder="Nickname"
          className="w-full p-2 border rounded"
        />
        <select
          value={formData.status}
          onChange={e => setFormData({ ...formData, status: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="archived">Archived</option>
          <option value="unknown">Unknown</option>
          <option value="pending">Pending</option>
        </select>
        <input
          type="text"
          value={formData.credential[0].id}
          onChange={e => setFormData({
            ...formData,
            credential: [{ ...formData.credential[0], id: e.target.value }]
          })}
          placeholder="Credential ID"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          value={formData.credential[0].login}
          onChange={e => setFormData({
            ...formData,
            credential: [{ ...formData.credential[0], login: e.target.value }]
          })}
          placeholder="Login"
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          value={formData.credential[0].password}
          onChange={e => setFormData({
            ...formData,
            credential: [{ ...formData.credential[0], password: e.target.value }]
          })}
          placeholder="Password"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {isEdit ? "Update" : "Save"}
        </button>
      </form>
    </div>
  );
};

export default DigitalIdentityForm;