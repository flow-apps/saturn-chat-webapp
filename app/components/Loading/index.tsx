import React from "react";
import { Lottie } from "lottie-react";
import loadingAnimation from "~/assets/loading.json";
import { Container, AnimationView } from "./styles";

const Loading: React.FC = () => {
  return (
    <Container>
      <AnimationView>
        <Lottie src={loadingAnimation} loop={true} autoplay={true} />
      </AnimationView>
    </Container>
  );
};

export default Loading;
