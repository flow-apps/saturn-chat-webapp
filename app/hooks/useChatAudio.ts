import { useState, useRef, useEffect, useCallback } from "react";

export const useChatAudio = (
  onSendAudio: (duration: number, audioFile: File) => Promise<void>
) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const clearTimer = () => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
  };
  

  const recordAudio = async (hasMessage?: boolean) => {
    if (hasMessage || isRecording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "";

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(100); // Coleta dados em chunks a cada 100ms
      startTimeRef.current = Date.now();
      setIsRecording(true);

      // 3. Atualiza a duração do áudio em milissegundos
      clearTimer();
      recordingIntervalRef.current = setInterval(() => {
        setAudioDuration(Date.now() - startTimeRef.current);
      }, 200);
    } catch (error) {
      console.error("Erro ao solicitar acesso ao microfone:", error);
      alert("Não foi possível acessar o microfone. Verifique as permissões do navegador.");
    }
  };

  const stopRecordAudioAndSubmit = useCallback(async () => {
    if (!isRecording || !mediaRecorderRef.current) return;

    const mediaRecorder = mediaRecorderRef.current;
    const finalDuration = Date.now() - startTimeRef.current;

    clearTimer();
    setIsRecording(false);
    setAudioDuration(0);

    // Promise para aguardar a finalização da coleta dos dados do gravador
    const audioBlob = await new Promise<Blob>((resolve) => {
      mediaRecorder.onstop = () => {
        const type = mediaRecorder.mimeType || "audio/webm";
        const blob = new Blob(audioChunksRef.current, { type });

        // Libera as faixas do microfone no navegador
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());
        resolve(blob);
      };

      mediaRecorder.stop();
    });

    // Envia se a duração for maior que 1.2 segundos (1200 ms)
    if (finalDuration > 1200 && audioBlob.size > 0) {
      const fileExtension = audioBlob.type.includes("mp4") ? "mp4" : "webm";
      const audioFile = new File(
        [audioBlob],
        `audio_${Date.now()}.${fileExtension}`,
        { type: audioBlob.type }
      );

      await onSendAudio(finalDuration, audioFile);
    }
  }, [isRecording, onSendAudio]);

  const cancelRecordAudio = useCallback(async () => {
    if (!isRecording || !mediaRecorderRef.current) return;

    clearTimer();
    setIsRecording(false);
    setAudioDuration(0);

    try {
      const mediaRecorder = mediaRecorderRef.current;
      if (mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
      }
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Erro ao cancelar gravação:", error);
    } finally {
      audioChunksRef.current = [];
    }
  }, [isRecording]);

  useEffect(() => {
    return () => {
      clearTimer();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    isRecording,
    audioDuration,
    recordAudio,
    stopRecordAudioAndSubmit,
    cancelRecordAudio,
  };
};