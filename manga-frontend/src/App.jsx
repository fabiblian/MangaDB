import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "../components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import ForbiddenPage from "./pages/Auth/ForbiddenPage";
import LeaderboardPage from "./pages/Leaderboard/LeaderboardPage";
import MangaList from "./pages/Mangas/MangaList";
import MangaNew from "./pages/Mangas/MangaNew";
import MangaEdit from "./pages/Mangas/MangaEdit";
import UserList from "./pages/Users/UserList";
import UserForm from "./pages/Users/UserForm";
import UserEdit from "./pages/Users/UserEdit";
import UserMangaList from "./pages/UserManga/UserMangaList";
import UserMangaForm from "./pages/UserManga/UserMangaForm";
import UserMangaEdit from "./pages/UserManga/UserMangaEdit";
import PublisherList from "./pages/Publishers/PublisherList";
import PublisherForm from "./pages/Publishers/PublisherForm";
import PublisherEdit from "./pages/Publishers/PublisherEdit";
import CategoryList from "./pages/Categories/CategoryList";
import CategoryForm from "./pages/Categories/CategoryForm";

export default function App() {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Navigate to="/mangas" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forbidden" element={<ForbiddenPage />} />

          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <LeaderboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mangas"
            element={
              <ProtectedRoute>
                <MangaList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mangas/new"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <MangaNew />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mangas/:id/edit"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <MangaEdit />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <UserList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/new"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <UserForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:id/edit"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <UserEdit />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user-manga"
            element={
              <ProtectedRoute>
                <UserMangaList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-manga/new"
            element={
              <ProtectedRoute>
                <UserMangaForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-manga/:id/edit"
            element={
              <ProtectedRoute>
                <UserMangaEdit />
              </ProtectedRoute>
            }
          />

          <Route
            path="/publishers"
            element={
              <ProtectedRoute>
                <PublisherList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/publishers/new"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <PublisherForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/publishers/:id/edit"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <PublisherEdit />
              </ProtectedRoute>
            }
          />

          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <CategoryList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories/new"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <CategoryForm />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
