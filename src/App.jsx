import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Error from "./pages/Error";
import { Toaster } from "sonner";

export default function App() {
  return (
    <Router>
      <Toaster
        position="top-center"
        toastOptions={{
          unstyled: true,
          classNames: {
            toast:
              "bg-surface text-text border border-text rounded-sm shadow-md px-4 py-3",
            title: "font-medium text-sm mb-1",
            description: "opacity-100 text-xs",
          },
        }}
        icons={{
          success: null,
          error: null,
          loading: null,
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}
