import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import DigitalIdentityList from "./components/DigitalIdentityList";
import DigitalIdentityForm from "./components/DigitalIdentityForm";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="digital-identities" element={<DigitalIdentityList />} />
          <Route path="digital-identities/new" element={<DigitalIdentityForm />} />
          <Route path="digital-identities/:id" element={<DigitalIdentityForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;