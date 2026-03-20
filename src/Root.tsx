import { useState } from "react";
import App from "./App.tsx";
import LoadingScreen from "./Components/Loading.tsx";

export default function Root() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && (
        <LoadingScreen onComplete={() => setLoading(false)} duration={2800} />
      )}
      <div style={{ visibility: loading ? "hidden" : "visible" }}>
        <App />
      </div>
    </>
  );
}
