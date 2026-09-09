import React, { createContext, useContext, useState } from "react";

interface AudioPlayerContextProps {
  currentAudioName: string;
  setCurrentAudioName: React.Dispatch<React.SetStateAction<string>>;
}

const AudioPlayerContext = createContext<AudioPlayerContextProps>(
  {} as AudioPlayerContextProps,
);

const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentAudioName, setCurrentAudioName] = useState("");

  return (
    <AudioPlayerContext.Provider
      value={{
        currentAudioName,
        setCurrentAudioName,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

const useAudioPlayer = () => useContext(AudioPlayerContext);

export { AudioPlayerProvider, useAudioPlayer };
