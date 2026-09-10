import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: ${(props) => props.theme.colors.background};
  overflow: hidden;
`;

export const SidebarWrapper = styled.aside`
  width: 280px;
  height: 100%;
  border-right: 1px solid ${(props) => props.theme.colors.shape || "#2f3336"};
  flex-shrink: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const ContentContainer = styled.main`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  align-items: center;
`;

export const PageHeader = styled.header`
  width: 100%;
  max-width: 680px;
  padding: 24px 20px 16px 20px;
  border-bottom: 1px solid ${(props) => props.theme.colors.shape || "#2f3336"};
`;

export const PageTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.dark_heading || props.theme.colors.text};
  margin: 0;
`;

export const SectionsWrapper = styled.div`
  width: 100%;
  max-width: 680px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

export const SectionGroup = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const SectionTitle = styled.h3`
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${(props) => props.theme.colors.dark_heading || "#888"};
  margin: 0 0 4px 4px;
`;

export const ConfigsList = styled.div`
  background-color: ${(props) => props.theme.colors.shape || "rgba(255, 255, 255, 0.03)"};
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const ConfigItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: ${(props) => props.theme.colors.black};
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.04);
  }
`;

export const ConfigTitle = styled.div<{ $highlight?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.95rem;
  font-weight: 500;
  color: ${(props) =>
    props.$highlight ? props.theme.colors.secondary : "inherit"};
`;

export const CurrentValue = styled.span`
  font-size: 0.85rem;
  color: ${(props) => props.theme.colors.dark_heading || "#888"};
`;

export const Switch = styled.input`
  cursor: pointer;
  width: 18px;
  height: 18px;
  accent-color: ${(props) => props.theme.colors.primary};
`;

export const Select = styled.select`
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid ${(props) => props.theme.colors.shape || "#ccc"};
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.black};
  font-size: 0.85rem;
  outline: none;
  cursor: pointer;
`;

export const SignOutButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px;
  border-radius: 12px;
  background-color: rgba(255, 0, 0, 0.1);
  color: ${(props) => props.theme.colors.red || "#ff4d4d"};
  border: 1px solid rgba(255, 0, 0, 0.2);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 0, 0, 0.2);
  }
`;

export const VersionFooter = styled.footer`
  text-align: center;
  font-size: 0.8rem;
  color: ${(props) => props.theme.colors.dark_heading || "#888"};
  margin-top: 10px;
  margin-bottom: 20px;
`;