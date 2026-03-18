import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import NavBar from "../components/NavBar";
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
          <Route path="/mangas" element={<MangaList />} />
          <Route path="/mangas/new" element={<MangaNew />} />
          <Route path="/mangas/:id/edit" element={<MangaEdit />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/new" element={<UserForm />} />
          <Route path="/users/:id/edit" element={<UserEdit />} />
          <Route path="/user-manga" element={<UserMangaList />} />
          <Route path="/user-manga/new" element={<UserMangaForm />} />
          <Route path="/user-manga/:id/edit" element={<UserMangaEdit />} />
          <Route path="/publishers" element={<PublisherList />} />
          <Route path="/publishers/new" element={<PublisherForm />} />
          <Route path="/publishers/:id/edit" element={<PublisherEdit />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/categories/new" element={<CategoryForm />} />
        </Routes>
      </main>
    </div>
  );
}


