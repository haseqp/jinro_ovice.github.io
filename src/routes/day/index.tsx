import { Button } from "@mui/material";
import { useBroadcastMessage } from "../../hooks/useOviceObject";

export const Day = () => {
  const broadcast = useBroadcastMessage();
  return (
    <div>
      <h1>Day</h1>
      <Button
        variant="text"
        onClick={() => {
          broadcast({ type: "dayAction", count: 1 });

          window.postMessage(
            { type: "ovice_message", payload: { type: "dayAction", count: 1 } },
            "*",
          );
        }}
      >
        Next
      </Button>
    </div>
  );
};
