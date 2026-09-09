import React from "react";
import { Loader2 } from "lucide-react";
import { Container, Spinner } from "./styles";

const LoadingIndicator: React.FC = () => {
  return (
    <Container>
      <Spinner>
        <Loader2 size={32} />
      </Spinner>
    </Container>
  );
};

export default LoadingIndicator;
