import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "./context/ThemeContext";
import { getCurrentUser } from "./features/getCurrentUser";
import { getConversations } from "./features/getConversations";
import { setUserData } from "./redux/userSlice";
import { setConversations } from "./redux/conversationSlice";

// Pages
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import WorkspacePage from "./pages/WorkspacePage";
import ConversationPage from "./pages/ConversationPage";
import AgentLibraryPage from "./pages/AgentLibraryPage";
import BillingPage from "./pages/BillingPage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";

// Route guard for authenticated pages
function ProtectedRoute({ children, authChecking }) {
  const userData = useSelector((state) => state.user?.userData);
  const location = useLocation();

  if (authChecking) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[var(--forge-canvas)] text-[var(--forge-text)] gap-3 select-none">
        <div className="w-10 h-10 rounded-xl bg-[var(--forge-accent)] text-[var(--forge-accent-text)] font-black text-sm flex items-center justify-center shadow-lg animate-pulse">
          AF
        </div>
        <div className="text-[11px] font-mono text-[var(--forge-text-muted)] tracking-wider uppercase">
          INITIALIZING WORKSPACE...
        </div>
      </div>
    );
  }

  if (!userData) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Route guard for public auth pages (login/signup)
function PublicAuthRoute({ children, authChecking }) {
  const userData = useSelector((state) => state.user?.userData);

  if (authChecking) {
    return null;
  }

  if (userData) {
    return <Navigate to="/app" replace />;
  }

  return children;
}

function AppContent() {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user?.userData);
  const [authChecking, setAuthChecking] = useState(true);

  // Initialize session and recent task history
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (user && isMounted) {
          dispatch(setUserData(user));
          // Preload recent tasks
          try {
            const convs = await getConversations();
            if (convs && isMounted) {
              dispatch(setConversations(convs));
            }
          } catch (convErr) {
            console.warn("Failed to preload conversations:", convErr);
          }
        }
      } catch (err) {
        console.warn("User session check completed without session:", err);
      } finally {
        if (isMounted) setAuthChecking(false);
      }
    };

    initAuth();
    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  // If user state becomes populated later, ensure conversations are loaded
  useEffect(() => {
    if (userData?._id) {
      getConversations().then((convs) => {
        if (convs) dispatch(setConversations(convs));
      });
    }
  }, [userData?._id, dispatch]);

  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          <PublicAuthRoute authChecking={authChecking}>
            <AuthPage />
          </PublicAuthRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicAuthRoute authChecking={authChecking}>
            <AuthPage />
          </PublicAuthRoute>
        }
      />

      {/* Protected Workspace Routes */}
      <Route
        path="/app"
        element={
          <ProtectedRoute authChecking={authChecking}>
            <WorkspacePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/c/:conversationId"
        element={
          <ProtectedRoute authChecking={authChecking}>
            <ConversationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/conversations/:id"
        element={
          <ProtectedRoute authChecking={authChecking}>
            <ConversationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/agents"
        element={
          <ProtectedRoute authChecking={authChecking}>
            <AgentLibraryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/billing"
        element={
          <ProtectedRoute authChecking={authChecking}>
            <BillingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/settings"
        element={
          <ProtectedRoute authChecking={authChecking}>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}
