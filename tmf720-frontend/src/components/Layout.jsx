import { Outlet, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

const Layout = () => {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "light" ? false : true; // Default to dark if no preference
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Theme Toggle in Top-Right Corner */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-full bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 flex items-center justify-center hover:bg-gray-700 dark:hover:bg-gray-300 transition-all"
        >
          <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
        </button>
      </div>

      {/* Sidebar */}
      <motion.div 
        className="w-64 p-6 space-y-6 shadow-lg dark:bg-gray-800 bg-gray-100"
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold dark:text-purple-400 text-purple-700">TMF720 Dashboard</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link 
                to="/" 
                className={`block py-2 px-4 rounded ${location.pathname === "/" ? "dark:bg-purple-600 bg-purple-200" : "dark:hover:bg-purple-700 hover:bg-purple-300"} transition-colors`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/digital-identities" 
                className={`block py-2 px-4 rounded ${location.pathname === "/digital-identities" ? "dark:bg-purple-600 bg-purple-200" : "dark:hover:bg-purple-700 hover:bg-purple-300"} transition-colors`}
              >
                Digital Identities
              </Link>
            </li>
          </ul>
        </nav>
      </motion.div>

      {/* Main Content */}
      <motion.main 
        className="flex-1 p-8 overflow-y-auto dark:bg-gray-900 bg-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export default Layout;