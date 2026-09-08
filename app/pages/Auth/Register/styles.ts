import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  padding: 55px;
`;

export const SideBySideContainer = styled.main`
  display: flex;
  width: 100%;
`;

export const PresentationContainer = styled.div`
  flex: 1;
  width: 50%;
  padding-right: 40px;
`;

export const PresentationTitle = styled.h1`
  font-size: 42px;
  margin-bottom: 12px;
`;

export const PresentationSubtitle = styled.p`
  color: ${(props) => props.theme?.colors?.light_heading || "#666"};
  font-size: 16px;
  line-height: 1.5;
`;

export const RegisterContainer = styled.div`
  display: flex;
  width: 50%;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const RegisterCard = styled.div`
  background-color: ${(props) => props.theme?.colors?.shape || "#1e1e24"};
  padding: 30px;
  border-radius: 15px;
  width: 85%;
  max-width: 520px;
`;

export const RegisterCardTitle = styled.h2`
  font-size: 26px;
`;

export const RegisterCardSubtitle = styled.p`
  margin-bottom: 20px;
  font-size: 14px;
  color: ${(props) => props.theme?.colors?.light_heading || "#aaa"};
`;

export const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
`;

export const SelectAvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

export const SelectAvatarButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  width: 150px;
  height: 150px;
  border: 3px dotted ${(props) => props.theme?.colors?.secondary || "#00b4d8"};
  border-radius: 50%;
  overflow: hidden;
  padding: 0;

  label {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
`;

export const Avatar = styled.img`
  border-radius: 50%;
  width: 100%;
  height: 100%;
  aspect-ratio: 1;
  object-fit: cover;
`;

export const SelectAvatarTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  margin-top: 8px;
`;

export const SelectAvatarSubtitle = styled.span`
  font-size: 12px;
  color: ${(props) => props.theme?.colors?.light_heading || "#888"};
`;

export const InputContainer = styled.div`
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
`;

export const FieldError = styled.span`
  color: #ff3333;
  font-size: 12px;
  margin-top: 4px;
`;

export const SearchText = styled.span`
  color: ${(props) => props.theme?.colors?.secondary || "#00b4d8"};
  font-size: 12px;
  margin-top: 4px;
`;

export const FieldInfoContainer = styled.div`
  margin-top: 2px;
`;

export const FieldInfo = styled.span`
  font-size: 11px;
  color: ${(props) => props.theme?.colors?.light_heading || "#888"};
`;

export const ErrorContainer = styled.div`
  background-color: rgba(255, 51, 51, 0.1);
  border: 1px solid #ff3333;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
`;

export const ErrorText = styled.p`
  color: #ff3333;
  font-size: 13px;
  text-align: center;
`;

export const ConsentText = styled.p`
  font-size: 12px;
  text-align: center;
  margin-top: 15px;
  color: ${(props) => props.theme?.colors?.light_heading || "#aaa"};

  a {
    color: ${(props) => props.theme?.colors?.secondary || "#00b4d8"};
    text-decoration: underline;
  }
`;

export const AlreadyHaveAccountContainer = styled.div`
  text-align: center;
  margin-top: 20px;

  a {
    color: ${(props) => props.theme?.colors?.secondary || "#00b4d8"};
    font-weight: bold;
  }
`;
