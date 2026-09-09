import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { Lottie } from "lottie-react";

import starAnimation from "~/assets/star.json";

import {
  Overlay,
  ModalCardContainer,
  ModalAnimationContainer,
  ModalTitle,
  ModalContent,
  ModalButton,
} from "./styles";

interface EmblemProps {
  visible: boolean;
  close: () => void;
  premium: boolean;
}

const StarLottieAnimation = () => {
  return (
    <ModalAnimationContainer>
      <Lottie src={starAnimation as object} loop={false} autoplay={true} />
    </ModalAnimationContainer>
  );
};
const EmblemModal = ({ visible, close, premium }: EmblemProps) => {
  const navigate = useNavigate();

  const handleGoPremium = () => {
    close();
    navigate("/purchase-premium");
  };

  // Fecha o modal ao pressionar 'Escape' na Web
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && visible) {
        close();
      }
    };

    if (visible) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible, close]);

  if (!visible) return null;

  return (
    <Overlay onClick={close}>
      <ModalCardContainer onClick={(e) => e.stopPropagation()}>
        <StarLottieAnimation />

        <ModalTitle>Emblema de Estrela</ModalTitle>

        <ModalContent>
          Esta estrela indica um usuário especial na plataforma.{" "}
          {!premium &&
            "Seja um assinante Premium para destacar seu perfil e liberar recursos exclusivos!"}
        </ModalContent>

        {!premium && (
          <ModalButton onClick={handleGoPremium}>Seja uma Estrela</ModalButton>
        )}
      </ModalCardContainer>
    </Overlay>
  );
};

export default EmblemModal;
