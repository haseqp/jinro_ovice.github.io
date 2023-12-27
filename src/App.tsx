import "./App.css";
import { Handshake } from "./routes/handshake";
import { Start, startedAtom } from "./routes/start";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEventHandler } from "./hooks/useEventHandler";
import { Debug } from "./components/debug";
import { ShowRole } from "./routes/showRole";
import { FirstNight } from "./routes/firstNight";
import { Waiting } from "./routes/waiting";
import { Executed } from "./routes/executed";
import { Day } from "./routes/day";
import { Night } from "./routes/night";
import { Suspense, useEffect } from "react";
import { Gameover } from "./routes/gameover";
import { useAtomValue } from "jotai";

function Loading() {
  return <p>Loading...</p>;
}

function App() {
  useEventHandler();
  const location = useLocation();
  const navigate = useNavigate();
  const started = useAtomValue(startedAtom);

  useEffect(() => {
    if (!started && location.pathname !== "/") {
      // for page refresh
      navigate('/');
    }
  }, [started, location.pathname, navigate]);

  return (
    <>
      <Suspense fallback={<Loading/>}>
        <Routes>
            <Route path="/" element={<Start />} />
            <Route path="/handshake" element={<Handshake />} />
            <Route path="/showRole" element={<ShowRole />} />
            <Route path="/firstNight" element={<FirstNight />} />
            <Route path="/waiting" element={<Waiting />} />
            <Route path="/day" element={<Day />} />
            <Route path="/executed" element={<Executed />} />
            <Route path="/night" element={<Night />} />
            <Route path="/gameover" element={<Gameover />} />
        </Routes>
      </Suspense>
      <br />
      <Debug />
    </>
  );
}

export default App;
