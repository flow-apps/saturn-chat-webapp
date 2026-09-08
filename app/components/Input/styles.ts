import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 12px;
`;

export const Label = styled.label`
  color: ${(props) => props.theme?.colors?.light_heading || "#666"};
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
`;

export const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

export const MainInput = styled.input<{ focused: boolean }>`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: none;
  border-radius: 15px;
  border-bottom: 1px solid
    ${(props) =>
      props.focused
        ? props.theme?.colors?.secondary || "#000"
        : props.theme?.colors?.dark_gray || "#ccc"};
  color: ${(props) => props.theme?.colors?.black || "#000"};
  background-color: ${(props) =>
    props.theme?.colors?.background || "transparent"};
  outline: none;
  transition: border-color 0.2s ease-in-out;
  font-family: Poppins, sans-serif;

  &::placeholder {
    color: ${(props) => (props.theme?.colors?.dark_heading || "#888") + "88"};
  }
`;

export const ShowPasswordButton = styled.button`
  position: absolute;
  right: 4px;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 4px;

  &:focus {
    outline: none;
  }
`;