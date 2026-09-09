import React, { useState, useCallback, useEffect } from "react";
import { X, Trash2, Plus } from "lucide-react";
import { toast } from "react-toastify";

import {
  Overlay,
  ModalContent,
  Header,
  Title,
  CloseButton,
  FormContent,
  Label,
  Input,
  OptionRow,
  OptionInput,
  RemoveOptionButton,
  AddOptionButton,
  AddOptionText,
  MultipleChoiceContainer,
  MultipleChoiceText,
  ToggleSwitch,
  SubmitButton,
} from "./styles";

interface PollModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    question: string;
    options: string[];
    allows_multiple: boolean;
  }) => void;
}

export const PollModal: React.FC<PollModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [allowsMultiple, setAllowsMultiple] = useState(false);

  const handleAddOption = useCallback(() => {
    if (options.length >= 10) {
      return toast.warning("O limite máximo é de 10 opções.");
    }
    setOptions((prev) => [...prev, ""]);
  }, [options.length]);

  const handleRemoveOption = useCallback(
    (index: number) => {
      if (options.length <= 2) {
        return toast.warning("A enquete precisa de no mínimo 2 opções.");
      }
      setOptions((prev) => prev.filter((_, i) => i !== index));
    },
    [options.length]
  );

  const handleOptionChange = useCallback((text: string, index: number) => {
    setOptions((prev) => {
      const updated = [...prev];
      updated[index] = text;
      return updated;
    });
  }, []);

  const handleResetAndClose = useCallback(() => {
    setQuestion("");
    setOptions(["", ""]);
    setAllowsMultiple(false);
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();

      const trimmedQuestion = question.trim();
      const filledOptions = options
        .map((opt) => opt.trim())
        .filter((opt) => opt.length > 0);

      if (!trimmedQuestion) {
        return toast.error("Digite uma pergunta para a enquete.");
      }

      if (filledOptions.length < 2) {
        return toast.error("Preencha pelo menos 2 opções válidas.");
      }

      onSubmit({
        question: trimmedQuestion,
        options: filledOptions,
        allows_multiple: allowsMultiple,
      });

      handleResetAndClose();
    },
    [question, options, allowsMultiple, onSubmit, handleResetAndClose]
  );

  // Suporte a fechamento ao pressionar 'Escape'
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && visible) {
        handleResetAndClose();
      }
    };

    if (visible) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible, handleResetAndClose]);

  if (!visible) return null;

  return (
    <Overlay onClick={handleResetAndClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Criar Enquete</Title>
          <CloseButton onClick={handleResetAndClose} type="button" title="Fechar">
            <X size={22} />
          </CloseButton>
        </Header>

        <FormContent onSubmit={handleSubmit}>
          <Label>Pergunta</Label>
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ex: Qual o horário da nossa reunião?"
            maxLength={255}
            autoFocus
          />

          <Label>Opções</Label>
          {options.map((opt, index) => (
            <OptionRow key={`poll_option_input_${index}`}>
              <OptionInput
                value={opt}
                onChange={(e) => handleOptionChange(e.target.value, index)}
                placeholder={`Opção ${index + 1}`}
                maxLength={255}
              />
              {options.length > 2 && (
                <RemoveOptionButton
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  title="Remover opção"
                >
                  <Trash2 size={18} />
                </RemoveOptionButton>
              )}
            </OptionRow>
          ))}

          {options.length < 10 && (
            <AddOptionButton type="button" onClick={handleAddOption}>
              <Plus size={18} />
              <AddOptionText>Adicionar Opção</AddOptionText>
            </AddOptionButton>
          )}

          <MultipleChoiceContainer>
            <MultipleChoiceText>Permitir várias respostas</MultipleChoiceText>
            <ToggleSwitch>
              <input
                type="checkbox"
                checked={allowsMultiple}
                onChange={(e) => setAllowsMultiple(e.target.checked)}
              />
              <span className="slider" />
            </ToggleSwitch>
          </MultipleChoiceContainer>

          <SubmitButton type="submit">Criar Enquete</SubmitButton>
        </FormContent>
      </ModalContent>
    </Overlay>
  );
};