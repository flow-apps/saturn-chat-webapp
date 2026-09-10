import React, { useState } from "react";
import { AlertCircle, X, Send } from "lucide-react";
import api from "~/services/api";
import { ReportToType, ReportType } from "~/types/enums";
import Loading from "~/components/Loading";

import {
  Overlay,
  ModalCard,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  Subtitle,
  FormContainer,
  SelectContainer,
  Label,
  Select,
  TextAreaContainer,
  TextArea,
  SubmitButton,
} from "./styles";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ReportToType;
  targetId: {
    userId?: string;
    groupId?: string;
    messageId?: string;
  };
}

const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  [ReportType.SPAM]: "Spam ou mensagem não solicitada",
  [ReportType.VIOLENCE]: "Violência, ameaças ou apologia ao crime",
  [ReportType.SEXUAL]: "Conteúdo sexual explícito ou pornografia",
  [ReportType.BULLYING]: "Assédio, intimidação ou bullying",
  [ReportType.RACISM]: "Racismo, discriminação ou discurso de ódio",
  [ReportType.SCAM]: "Golpe, fraude ou compartilhamento de links suspeitos",
  [ReportType.FAKE]: "Conta ou perfil falso (falsidade ideológica)",
  [ReportType.DMCA]: "Violação de direitos autorais ou propriedade intelectual",
  [ReportType.OTHER]: "Outro motivo não listado acima",
};

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  type,
  targetId,
}) => {
  const [reportType, setReportType] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportType) return;

    setLoading(true);

    try {
      const response = await api.post("/reports", {
        type: reportType,
        to_type: type,
        to_user_id: type === ReportToType.USER ? targetId.userId : undefined,
        to_group_id: type === ReportToType.GROUP ? targetId.groupId : undefined,
        to_message_id:
          type === ReportToType.MESSAGE ? targetId.messageId : undefined,
        message,
      });

      if (response.status === 200 || response.status === 201) {
        alert("Denúncia enviada com sucesso. Agradecemos por ajudar a manter a comunidade segura!");
        handleClose();
      }
    } catch (error) {
      console.error("Erro ao enviar denúncia:", error);
      alert("Não foi possível enviar a denúncia. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReportType("");
    setMessage("");
    onClose();
  };

  return (
    <Overlay onClick={handleClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <AlertCircle size={20} />
            Denunciar
          </ModalTitle>
          <CloseButton onClick={handleClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Subtitle>
            Selecione o motivo que melhor descreve o problema. Todas as denúncias são confidenciais e analisadas pela nossa equipe.
          </Subtitle>

          {loading ? (
            <Loading />
          ) : (
            <FormContainer onSubmit={handleReport}>
              <SelectContainer>
                <Label htmlFor="report-type-select">Motivo da denúncia</Label>
                <Select
                  id="report-type-select"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <option value="" disabled>
                    Selecione um motivo...
                  </option>
                  {Object.values(ReportType).map((tValue) => (
                    <option key={tValue} value={tValue}>
                      {REPORT_TYPE_LABELS[tValue as ReportType] || tValue}
                    </option>
                  ))}
                </Select>
              </SelectContainer>

              <TextAreaContainer>
                <Label htmlFor="report-details">
                  Informe mais detalhes (opcional)
                </Label>
                <TextArea
                  id="report-details"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Descreva o ocorrido para nos ajudar na análise..."
                  rows={4}
                />
              </TextAreaContainer>

              <SubmitButton type="submit" disabled={!reportType || loading}>
                <Send size={18} />
                Enviar Denúncia
              </SubmitButton>
            </FormContainer>
          )}
        </ModalBody>
      </ModalCard>
    </Overlay>
  );
};

export default ReportModal;