import { useState } from "react";
import App from "./App";
import LoadingScreen from "./Components/Loading";

if (typeof window !== "undefined") {
  window.history.scrollRestoration = "manual";
}

export default function Root() {
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  const handleComplete = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setLoading(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
  };

  return (
    <>
      {loading && <LoadingScreen onComplete={handleComplete} duration={3800} />}
      <div style={{ visibility: loading ? "hidden" : "visible" }}>
        <App ready={ready} />
      </div>
    </>
  );
}
