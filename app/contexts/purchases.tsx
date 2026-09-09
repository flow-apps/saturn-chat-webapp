import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "~/services/api";
import { useAuth } from "./auth";
import { PaymentState } from "~/types/enums";
import { UserData } from "~/types/interfaces";

type PlanPeriods = "MONTHLY" | "QUARTERLY" | "YEARLY";

export interface UserSubscription {
  id: string;
  auto_renewing: boolean;
  cancel_reason: number;
  expiry_in: number;
  hasSubscription: boolean;
  isActive: boolean;
  isPaused: boolean;
  package_name: string;
  payment_state: PaymentState;
  purchase_token: string;
  purchase_type: number;
  resume_in: number | null;
  started_at: number;
  subscription_id: string;
  subscription_period: string;
  user: UserData;
  user_id: string;
}

interface PurchasesContextProps {
  handleBuySubscription: (
    sku: string,
    offerToken?: string,
    period?: PlanPeriods
  ) => Promise<void>;
  handleGetUserSubscription: () => Promise<void>;
  clearStates: () => void;
  subscriptions: any[];
  buySubFinished: boolean;
  purchaseSuccess: boolean;
  purchaseError: boolean;
  loadingPurchase: boolean;
  currentPlanSelected: PlanPeriods | undefined;
  userSubscription: UserSubscription | null;
}

const PurchasesContext = createContext<PurchasesContextProps>(
  {} as PurchasesContextProps
);

const PurchasesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [buySubFinished, setBuySubFinished] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [purchaseError, setPurchaseError] = useState(false);
  const [loadingPurchase, setLoadingPurchase] = useState(false);
  const [currentPlanSelected, setCurrentPlanSelected] = useState<PlanPeriods>();
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);

  const { signed } = useAuth();

  const clearStates = useCallback(() => {
    setBuySubFinished(false);
    setPurchaseError(false);
    setPurchaseSuccess(false);
    setLoadingPurchase(false);
    setCurrentPlanSelected(undefined);
  }, []);

  // Busca a assinatura atual do usuário no servidor
  const handleGetUserSubscription = useCallback(async () => {
    try {
      const res = await api.get("/subscriptions");
      setUserSubscription(res.data);
    } catch (error) {
      console.error("[PurchasesProvider] Erro ao buscar assinatura do usuário:", error);
    }
  }, []);

  // Inicia o fluxo de checkout web (Stripe / Gateway Web)
  const handleBuySubscription = useCallback(
    async (sku: string, offerToken?: string, period: PlanPeriods = "MONTHLY") => {
      try {
        setLoadingPurchase(true);
        setCurrentPlanSelected(period);

        // Chamada à API para gerar URL do checkout do gateway (ex: Stripe Checkout)
        const response = await api.post("/subscriptions/checkout-session", {
          plan: period,
          sku,
          redirect_url: window.location.origin + "/purchase-status",
        });

        if (response.data?.checkout_url) {
          // Redireciona o usuário para a página segura de pagamento do gateway
          window.location.href = response.data.checkout_url;
        } else {
          setPurchaseError(true);
          setLoadingPurchase(false);
        }
      } catch (error) {
        console.error("[PurchasesProvider] Erro ao iniciar checkout web:", error);
        setPurchaseError(true);
        setPurchaseSuccess(false);
        setBuySubFinished(true);
        setLoadingPurchase(false);
      }
    },
    []
  );

  useEffect(() => {
    if (signed) {
      handleGetUserSubscription();
    } else {
      setUserSubscription(null);
    }
  }, [signed, handleGetUserSubscription]);

  return (
    <PurchasesContext.Provider
      value={{
        handleBuySubscription,
        handleGetUserSubscription,
        clearStates,
        currentPlanSelected,
        loadingPurchase,
        subscriptions: [], // Pode ser alimentado com planos retornados do backend caso necessário
        buySubFinished,
        purchaseSuccess,
        purchaseError,
        userSubscription,
      }}
    >
      {children}
    </PurchasesContext.Provider>
  );
};

const usePurchases = () => {
  return useContext(PurchasesContext);
};

export { PurchasesProvider, usePurchases };