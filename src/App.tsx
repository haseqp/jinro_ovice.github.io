import "./App.css";
import { Handshake } from "./routes/handshake";
import { Start } from "./routes/start";
import { Routes, Route } from "react-router-dom";
import { useEventHandler } from "./hooks/useEventHandler";
import { Debug } from "./components/debug";
import { ShowRole } from "./routes/showRole";
import { FirstNight } from "./routes/firstNight";
import { Sleeping } from "./routes/sleeping";
import { Day } from "./routes/day";

function App() {
  useEventHandler();

  return (
    <>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/handshake" element={<Handshake />} />
        <Route path="/showRole" element={<ShowRole />} />
        <Route path="/firstNight" element={<FirstNight />} />
        <Route path="/sleeping" element={<Sleeping />} />
        <Route path="/day" element={<Day />} />
      </Routes>
      <br />
      <Debug />
    </>
  );
}

export default App;
