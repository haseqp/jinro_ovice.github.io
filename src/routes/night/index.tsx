import { SeerNight } from "../../components/seer";
import { useGameRole } from "../../hooks/useGameRole";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WolfNight, type WolfAction } from "../../components/wolf";
import { HunterNight, type HunterAction } from "../../components/hunter"; 

export const Night = () => {
  const { myRole } = useGameRole();
  const navigate = useNavigate();
  const next = "/attacked";

  const toNavigate = useCallback(() => {
    navigate("/waiting", { state: { next } });
  }, [navigate]);

  useEffect(() => {
    if (myRole === undefined || myRole.role === "seer" || myRole.role === "wolf" || myRole.role === "hunter") {
      return;
    }
    toNavigate();
  }, [toNavigate, myRole]);

  useEffect(() => {
    if (myRole?.isDead ?? false) {
      toNavigate();
    }
  }, [toNavigate, myRole]);

  if (myRole?.role === "wolf") {
    return (
      <WolfNight
        onClick={(action: WolfAction) => {
          navigate("/waiting", { state: { action, next } });
        }}
      />
    );
  } else if (myRole?.role === "hunter") {
    return (
      <HunterNight
        onClick={(action: HunterAction) => {
          navigate("/waiting", { state: { action, next } });
        }}
      />
    );
  } else if (myRole?.role === "seer") {
    return <SeerNight onClick={toNavigate} />;
  } else {
    return null;
  }
};
