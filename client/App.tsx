import React, { useEffect, useState } from "react";
import { auth, provider } from "./firebase";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import {
  getUserSleepSchedules,
  getUserSleepEntries,
} from "./firebaseService";

const App = () => {
  const [user, setUser] = useState<any>(null);

  const [schedules, setSchedules] = useState<any[]>([]);
  const [entries, setEntries] = useState<any[]>([]);

  const [lastScheduleDoc, setLastScheduleDoc] = useState<any>(null);
  const [lastEntryDoc, setLastEntryDoc] = useState<any>(null);

  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [loadingEntries, setLoadingEntries] = useState(false);

  const pageSize = 10;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchSchedules(currentUser.uid, true);
      if (currentUser) fetchEntries(currentUser.uid, true);
    });
    return () => unsubscribe();
  }, []);

  const fetchSchedules = async (userId: string, reset = false) => {
    setLoadingSchedules(true);
    try {
      const { schedules: newSchedules, lastDoc } = await getUserSleepSchedules(
        userId,
        pageSize,
        reset ? null : lastScheduleDoc
      );
      setSchedules(reset ? newSchedules : [...schedules, ...newSchedules]);
      setLastScheduleDoc(lastDoc);
    } catch (err) {
      console.error("Error fetching schedules:", err);
    } finally {
      setLoadingSchedules(false);
    }
  };

  const fetchEntries = async (userId: string, reset = false) => {
    setLoadingEntries(true);
    try {
      const { entries: newEntries, lastDoc } = await getUserSleepEntries(
        userId,
        pageSize,
        reset ? null : lastEntryDoc
      );
      setEntries(reset ? newEntries : [...entries, ...newEntries]);
      setLastEntryDoc(lastDoc);
    } catch (err) {
      console.error("Error fetching entries:", err);
    } finally {
      setLoadingEntries(false);
    }
  };

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      fetchSchedules(result.user.uid, true);
      fetchEntries(result.user.uid, true);
    } catch (err) {
      console.error("Sign-in error:", err);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      {!user ? (
        <button onClick={handleSignIn} style={{ padding: "10px 20px", fontSize: "16px" }}>
          Sign in with Google
        </button>
      ) : (
        <>
          <h1>Welcome, {user.displayName}</h1>

          <section style={{ marginTop: "30px" }}>
            <h2>Sleep Schedules</h2>
            {loadingSchedules && <p>Loading schedules...</p>}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {schedules.map((s) => (
                <div
                  key={s.id}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "10px",
                    width: "200px",
                  }}
                >
                  <p><strong>Created:</strong> {new Date(s.createdAt.seconds * 1000).toLocaleString()}</p>
                  <p><strong>Details:</strong> {s.details || "N/A"}</p>
                </div>
              ))}
            </div>
            {lastScheduleDoc && !loadingSchedules && (
              <button onClick={() => fetchSchedules(user.uid)}>Load More</button>
            )}
          </section>

          <section style={{ marginTop: "30px" }}>
            <h2>Sleep Entries</h2>
            {loadingEntries && <p>Loading entries...</p>}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {entries.map((e) => (
                <div
                  key={e.id}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "10px",
                    width: "200px",
                  }}
                >
                  <p><strong>Date:</strong> {new Date(e.date.seconds * 1000).toLocaleDateString()}</p>
                  <p><strong>Hours:</strong> {e.hours || "N/A"}</p>
                </div>
              ))}
            </div>
            {lastEntryDoc && !loadingEntries && (
              <button onClick={() => fetchEntries(user.uid)}>Load More</button>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default App;
