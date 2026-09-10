import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
`;

export const ModalCard = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.black};
  width: 50%;
  max-height: 85vh;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.24);
  position: relative;
  overflow: hidden;
`;

export const ModalHeader = styled.div`
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${(props) => props.theme.colors.shape || "#eee"};
`;

export const ModalTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.dark_heading || "inherit"};
  margin: 0;
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.black};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

export const ModalBody = styled.div`
  padding: 16px 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const OptionsGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SectionTitle = styled.h4<{ $danger?: boolean }>`
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 4px 0;
  color: ${(props) =>
    props.$danger ? props.theme.colors.red : props.theme.colors.dark_heading};
`;

export const OptionItem = styled.button<{ $danger?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s ease;
  color: ${(props) =>
    props.$danger ? props.theme.colors.red : props.theme.colors.black};

  &:hover {
    background-color: ${(props) =>
      props.$danger ? "rgba(255, 0, 0, 0.08)" : "rgba(0, 0, 0, 0.04)"};
  }
`;

export const OptionText = styled.span<{ $danger?: boolean }>`
  font-size: 0.95rem;
  flex: 1;
  color: ${(props) => (props.$danger ? props.theme.colors.red : "inherit")};
`;

export const OptionAction = styled.div`
  display: flex;
  align-items: center;
`;

export const Select = styled.select`
  padding: 12px 20px;
  border-radius: 6px;
  border: 1px solid ${(props) => props.theme.colors.shape || "#ccc"};
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.black};
  font-size: 0.85rem;
  outline: none;
`;

export const Switch = styled.input`
  cursor: pointer;
  width: 18px;
  height: 18px;
  accent-color: ${(props) => props.theme.colors.primary};
`;

export const SaveFAB = styled.button`
  position: absolute;
  right: 20px;
  bottom: 20px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.primary};
  color: #fff;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    transform 0.2s,
    background-color 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;
