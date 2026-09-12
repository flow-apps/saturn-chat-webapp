import React from "react";
import { useLocation, useNavigate } from "react-router";
import { useCallStatus } from "~/contexts/callStatus";

export const CallFloatingButton: React.FC = () => {
  const { activeCallRoomId, endCall } = useCallStatus();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Se não houver ID de chamada ativa no contexto, NUNCA exibe o botão
  if (!activeCallRoomId) {
    return null;
  }

  // 2. Se o usuário estiver na tela da própria chamada, oculta o botão flutuante
  const isOnCallScreen = location.pathname.includes("/call");
  if (isOnCallScreen) {
    return null;
  }

  const handleReturnToCall = () => {
    navigate(`/call/${activeCallRoomId}`);
  };

  const handleForceHangup = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede a navegação ao clicar em encerrar
    endCall(); // Força a destruição da sala e do botão
  };

  return (
    <div
      onClick={handleReturnToCall}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        backgroundColor: "#FF9D00",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 99999,
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.4)",
        color: "#FFFFFF",
        fontWeight: 700,
        fontSize: "14px",
        cursor: "pointer",
      }}
    >
      <span>Chamada em andamento — Clique para retornar</span>

      <button
        onClick={handleForceHangup}
        style={{
          backgroundColor: "#E83F5B",
          color: "#FFF",
          border: "none",
          padding: "6px 14px",
          borderRadius: "20px",
          fontWeight: 600,
          cursor: "pointer",
          fontSize: "12px",
        }}
      >
        Encerrar
      </button>
    </div>
  );
};

export default CallFloatingButton;
