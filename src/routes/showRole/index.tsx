import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGameRole } from "../../hooks/useGameRole";

export const ShowRole = () => {
  const { myRole } = useGameRole();
  const navigate = useNavigate();

  return (
    <div>
      <h1>Your Role is {myRole?.role ?? ""}</h1>
      <Button
        variant="text"
        onClick={() => {
          navigate("/firstNight");
        }}
      >
        Next
      </Button>
    </div>
  );
};
