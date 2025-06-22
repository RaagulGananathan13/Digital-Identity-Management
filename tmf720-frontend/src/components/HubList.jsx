import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const HubList = () => {
  const [hubs, setHubs] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/hub")
      .then(response => setHubs(response.data))
      .catch(error => console.error("Error fetching hubs:", error));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Hubs</h2>
      <Link to="/hubs/new" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">Add New</Link>
      <ul className="space-y-2">
        {hubs.map(hub => (
          <li key={hub.id} className="bg-white p-4 rounded shadow">
            <Link to={`/hubs/${hub.id}`} className="text-blue-600 hover:underline">
              {hub.callback || hub.id}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HubList;