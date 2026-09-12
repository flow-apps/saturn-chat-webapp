import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { motion, PanInfo } from "framer-motion";
import { Phone, PhoneOff } from "lucide-react";

import { useCallStatus } from "~/contexts/callStatus";

export const CallFloatingButton: React.FC = () => {
  const { activeCallRoomId, endCall } = useCallStatus();
  const location = useLocation();
  const navigate = useNavigate();

  const constraintsRef = useRef<HTMLDivElement>(null);
  // Flag para identificar se o elemento foi movido durante o clique
  const isDraggingRef = useRef<boolean>(false);

  if (!activeCallRoomId) {
    return null;
  }

  const isOnCallScreen = location.pathname.includes("/call");
  if (isOnCallScreen) {
    return null;
  }

  // Reseta o estado ao iniciar o arraste
  const handleDragStart = () => {
    isDraggingRef.current = false;
  };

  // Marca como arraste se houver movimento significativo (mais de 3px de deslocamento)
  const handleDrag = (_: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 3 || Math.abs(info.offset.y) > 3) {
      isDraggingRef.current = true;
    }
  };

  const handleReturnToCall = () => {
    // Se foi um arraste, ignora o clique e reseta a flag
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      return;
    }

    navigate(`/call/${activeCallRoomId}`);
  };

  const handleForceHangup = (e: React.MouseEvent) => {
    e.stopPropagation();
    endCall();
  };

  return (
    <>
      {/* Container invisível de limite de 100% da viewport */}
      <div
        ref={constraintsRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          zIndex: 99998,
        }}
      />

      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.05}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8 }}
        onClick={handleReturnToCall}
        style={{
          position: "fixed",
          top: "24px",
          right: "24px",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          gap: "12px",
          backgroundColor: "rgba(24, 24, 27, 0.92)",
          border: "1px solid rgba(255, 157, 0, 0.4)",
          backdropFilter: "blur(12px)",
          padding: "10px 16px",
          borderRadius: "40px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.45)",
          color: "#FFFFFF",
          cursor: "grab",
          userSelect: "none",
          touchAction: "none",
        }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ cursor: "grabbing" }}
      >
        {/* Indicador Verde + Ícone */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#22c55e",
              boxShadow: "0 0 8px #22c55e",
            }}
          />
          <Phone size={16} color="#FF9D00" />
        </div>

        {/* Texto Informativo */}
        <span style={{ fontSize: "13px", fontWeight: 600, color: "#F4F4F5" }}>
          Chamada ativa
        </span>

        {/* Botão de Desconectar */}
        <button
          onClick={handleForceHangup}
          title="Encerrar chamada"
          style={{
            backgroundColor: "#E83F5B",
            color: "#FFF",
            border: "none",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            marginLeft: "4px",
            transition: "transform 0.2s, background-color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#c53030")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#E83F5B")
          }
        >
          <PhoneOff size={14} />
        </button>
      </motion.div>
    </>
  );
};

export default CallFloatingButton;
