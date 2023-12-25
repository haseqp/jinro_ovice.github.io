import { SeerNight } from "../../components/seer";
import { useGameRole } from "../../hooks/useGameRole";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { WolfNight, type WolfAction } from "../../components/wolf";

export const Night = () => {
  const { myRole } = useGameRole();
  const navigate = useNavigate();

  const toNavigate = useCallback(() => {
    navigate("/waiting");
  }, [navigate]);

  if (myRole?.role === "wolf") {
    return (
      <WolfNight
        onClick={(action: WolfAction) => {
          navigate("/waiting", { state: { action, next: "/day" } });
        }}
      />
    );
  } else if (myRole?.role === "seer") {
    return <SeerNight onClick={toNavigate} />;
  } else {
    toNavigate();
    return null;
  }
};
