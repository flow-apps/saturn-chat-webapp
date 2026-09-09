import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import api from "~/services/api";
import { useAuth } from "./auth";
import { usePurchases } from "./purchases";

interface PremiumContextProps {
  isPremium: boolean;
}

const PremiumContext = createContext<PremiumContextProps>(
  {} as PremiumContextProps,
);

const POLLING_INTERVAL_MS = 30 * 1000; // 30 segundos

const PremiumProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { purchaseSuccess, userSubscription } = usePurchases();
  const { signed } = useAuth();

  const [isPremium, setIsPremium] = useState(false);

  const handleGetPremium = useCallback(async () => {
    try {
      const { data } = await api.get("/subscriptions/validate");
      if (data?.isActive !== isPremium) {
        setIsPremium(!!data?.isActive);
      }
    } catch (error) {
      console.error("[PremiumContext] Erro ao validar assinatura:", error);
    }
  }, [isPremium]);

  useEffect(() => {
    if (!signed) {
      setIsPremium(false);
      return;
    }

    handleGetPremium();

    const interval = setInterval(() => {
      handleGetPremium();
    }, POLLING_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [signed, handleGetPremium]);

  useEffect(() => {
    if (!userSubscription) return;
    setIsPremium(!!userSubscription.isActive);
  }, [userSubscription]);

  useEffect(() => {
    if (purchaseSuccess) {
      handleGetPremium();
    }
  }, [purchaseSuccess, handleGetPremium]);

  return (
    <PremiumContext.Provider value={{ isPremium }}>
      {children}
    </PremiumContext.Provider>
  );
};

const usePremium = () => {
  const premiumContext = useContext(PremiumContext);
  return premiumContext;
};

export { PremiumProvider, usePremium };
