import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";

const Home = lazy(() => import("./pages/Home.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Playground = lazy(() => import("./pages/Playground.jsx"));
const RamsHeal = lazy(() => import("./pages/RamsHeal.jsx"));
const CoStarInternship = lazy(() => import("./pages/CoStarInternship.jsx"));
const TuneFuse = lazy(() => import("./pages/TuneFuse.jsx"));

/* On every route change: jump to top, unless the URL has a #hash,
   in which case scroll smoothly to that element (e.g. "/#work"). */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
      const t = setTimeout(() => {
        const el2 = document.getElementById(id);
        if (el2) el2.scrollIntoView({ behavior: "smooth" });
      }, 60);
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollManager />
      <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/work/rams-heal" element={<RamsHeal />} />
          <Route path="/work/costar-internship" element={<CoStarInternship />} />
          <Route path="/work/tunefuse" element={<TuneFuse />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
