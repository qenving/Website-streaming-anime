import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Footer, LoadingSpinner, Navbar } from "./components";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

const HomePage = lazy(() => import("./pages/index.jsx"));
const AnimeDetailPage = lazy(() => import("./pages/anime/[slug].jsx"));
const WatchEpisodePage = lazy(() => import("./pages/watch/[anime]/[episode].jsx"));
const GenresPage = lazy(() => import("./pages/genres.jsx"));
const SearchPage = lazy(() => import("./pages/search.jsx"));
const PremiumPage = lazy(() => import("./pages/premium.jsx"));
const LoginPage = lazy(() => import("./pages/login.jsx"));
const RegisterPage = lazy(() => import("./pages/register.jsx"));
const ProfilePage = lazy(() => import("./pages/profile.jsx"));
const CommunityPage = lazy(() => import("./pages/community.jsx"));
const AboutPage = lazy(() => import("./pages/about.jsx"));
const NotFoundPage = lazy(() => import("./pages/404.jsx"));

const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);
  return null;
};

const AppShell = () => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <Suspense
      fallback={
        <div className="container py-24">
          <LoadingSpinner label="Loading" />
        </div>
      }
    >
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/anime/:slug" element={<AnimeDetailPage />} />
          <Route path="/watch/:anime/:episode" element={<WatchEpisodePage />} />
          <Route path="/genres" element={<GenresPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </Suspense>
    <Footer />
  </div>
);

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
