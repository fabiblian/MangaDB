import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getApiErrorMessage } from "../../api/client";
import { useAuth } from "../../contexts/AuthContext";
import { UserMangaApi } from "../../api/userMangaApi";

const STATUS_PRIORITY = {
  COMPLETED: 4,
  READING: 3,
  PLANNED: 2,
  DROPPED: 1,
};

function chooseRepresentative(current, candidate) {
  if (!current) return candidate;

  const currentPriority = STATUS_PRIORITY[current.status] ?? 0;
  const candidatePriority = STATUS_PRIORITY[candidate.status] ?? 0;

  if (candidatePriority !== currentPriority) {
    return candidatePriority > currentPriority ? candidate : current;
  }

  const currentVolume = current.manga?.volume ?? 0;
  const candidateVolume = candidate.manga?.volume ?? 0;

  if (candidateVolume !== currentVolume) {
    return candidateVolume > currentVolume ? candidate : current;
  }

  return (candidate.id ?? 0) > (current.id ?? 0) ? candidate : current;
}

export default function UserMangaList() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const isAdmin = user?.role === "ADMIN";
  const showUserColumn = isAdmin;
  const showActionColumn = items.length > 0;

  const groupedItems = useMemo(
    () =>
      Object.values(
        items.reduce((accumulator, item) => {
          const userKey = item.user?.id ?? "self";
          const titleKey = item.manga?.title ?? `item-${item.id}`;
          const key = `${userKey}::${titleKey}`;
          const existing = accumulator[key];

          if (!existing) {
            accumulator[key] = {
              key,
              user: item.user,
              title: item.manga?.title ?? "",
              representative: item,
            };
            return accumulator;
          }

          accumulator[key] = {
            ...existing,
            representative: chooseRepresentative(existing.representative, item),
          };
          return accumulator;
        }, {}),
      ).sort((left, right) => {
        if (showUserColumn) {
          const userCompare = (left.user?.username ?? "").localeCompare(right.user?.username ?? "", "de");
          if (userCompare !== 0) return userCompare;
        }

        return (left.title ?? "").localeCompare(right.title ?? "", "de");
      }),
    [items, showUserColumn],
  );

  const load = async () => {
    setError("");
    try {
      setItems(await UserMangaApi.list());
    } catch (e) {
      setError(getApiErrorMessage(e, "Fehler beim Laden"));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id) => {
    if (!confirm("Status-Eintrag wirklich löschen?")) return;
    try {
      await UserMangaApi.remove(id);
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e, "Löschen fehlgeschlagen"));
    }
  };

  return (
    <div>
      <div className="page-head">
        <h2>User-Manga Status</h2>
        <div className="page-actions">
          <Link className="action-link" to="/user-manga/new">
            Status Neu
          </Link>
        </div>
      </div>
      {error && <div style={{ color: "red", marginBottom: 12 }}>{String(error)}</div>}

      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {showUserColumn ? <th>User</th> : null}
            <th>Manga</th>
            <th>Status</th>
            <th>Rating</th>
            <th>Note</th>
            {showActionColumn ? <th>Aktion</th> : null}
          </tr>
        </thead>
        <tbody>
          {groupedItems.map((grouped) => {
            const item = grouped.representative;
            return (
              <tr key={grouped.key}>
                {showUserColumn ? <td>{grouped.user?.username}</td> : null}
                <td>{grouped.title}</td>
                <td>{item.status}</td>
                <td>{item.rating ?? ""}</td>
                <td>{item.note ?? ""}</td>
                {showActionColumn ? (
                  <td>
                    <Link to={`/user-manga/${item.id}/edit`}>Edit</Link>{" "}
                    <button onClick={() => onDelete(item.id)}>Delete</button>
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
