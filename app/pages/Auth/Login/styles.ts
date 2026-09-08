import styled from "styled-components";

export const Container = styled.div`
  height: 100%;
  padding: 55px;
`;

export const SideBySideContainer = styled.main`
  display: flex;
`;

export const PresentationContainer = styled.div`
  flex: 1;
  width: 50%;
`;

export const PresentationTitle = styled.h1`
  font-size: 42px;
  margin-bottom: 12px;
`;

export const PresentationSubtitle = styled.p`
  color: ${(props) => props.theme.colors.light_heading};
  font-size: 16px;
`;

export const LoginContainer = styled.div`
  display: flex;
  width: 50%;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const LoginCard = styled.div`
  background-color: ${(props) => props.theme.colors.shape};
  padding: 25px;
  border-radius: 15px;
  width: 70%;
`;

export const LoginCardTitle = styled.h2`
  font-size: 26px;
`;

export const LoginCardSubtitle = styled.p`
  margin-bottom: 20px;
  font-size: 14px;
`;

export const LoginForm = styled.form``;

export const InputContainer = styled.div`
  margin-top: 15px;
`;

export const NewAccountContainer = styled.div`
  text-align: center;
  margin-top: 30px;

  a {
    color: ${(props) => props.theme.colors.secondary};
    font-weight: bold;
  }
`;
