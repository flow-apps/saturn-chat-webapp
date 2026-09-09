import React, { useState } from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import EmblemModal from "~/components/Modals/EmblemModal";
import { usePremium } from "~/contexts/premium";
import {
  Container,
  EmblemContainer,
  NameContainer,
  Name,
  NicknameContainer,
  NicknameText,
} from "./styles";

export interface PremiumNameProps {
  name?: string;
  nameSize?: number;
  fontFamily?: string;
  emblemSize?: number;
  color?: string;
  align?: "center" | "right";
  hasPremium?: boolean;
  nickname?: string;
  showNickname?: boolean;
}

const PremiumName: React.FC<PremiumNameProps> = ({
  name,
  nickname,
  emblemSize,
  nameSize = 16,
  color,
  align,
  hasPremium,
  showNickname,
}) => {
  const { isPremium } = usePremium();
  const [showEmblemDetails, setShowEmblemDetails] = useState(false);

  const handleEmblemDetails = () => {
    setShowEmblemDetails((old) => !old);
  };

  return (
    <>
      <EmblemModal
        premium={isPremium}
        close={() => setShowEmblemDetails(false)}
        visible={showEmblemDetails}
      />
      <Container $align={align}>
        {hasPremium && (
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ display: "inline-flex" }}
          >
            <EmblemContainer
              onClick={handleEmblemDetails}
              title="Usuário Premium"
              type="button"
            >
              <Star
                size={emblemSize || nameSize + 4}
                fill="currentColor"
                stroke="none"
              />
            </EmblemContainer>
          </motion.div>
        )}

        <NameContainer>
          <Name $nameSize={nameSize} $color={color}>
            {name}
          </Name>
          {showNickname && nickname && (
            <NicknameContainer>
              <NicknameText>@{nickname}</NicknameText>
            </NicknameContainer>
          )}
        </NameContainer>
      </Container>
    </>
  );
};

export default PremiumName;
