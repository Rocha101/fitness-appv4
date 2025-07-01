import { useState } from "react";
import { router } from "expo-router";
import { authClient } from "@/lib/auth-client";
import { useCustomAlert } from "@/components/custom-alert";

export function useSettings() {
  const { data: session } = authClient.useSession();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const { showSuccess, showError, AlertComponent } = useCustomAlert();

  const handleLogout = () => {
    router.replace("/auth");
    authClient.signOut();
  };

  const handleUpdateName = async (newName: string) => {
    setIsUpdatingName(true);

    return new Promise<void>((resolve, reject) => {
      authClient.updateUser(
        { name: newName },
        {
          onSuccess: () => {
            resolve();
          },
          onError: (error: any) => {
            reject(new Error(error.message || "Falha ao atualizar nome"));
          },
          onResponse: () => {
            setIsUpdatingName(false);
          },
        },
      );
    });
  };

  const handleUpdateEmail = async (newEmail: string) => {
    setIsUpdatingEmail(true);

    return new Promise<void>((resolve, reject) => {
      authClient.changeEmail(
        {
          newEmail: newEmail,
          callbackURL: "/dashboard",
        },
        {
          onSuccess: () => {
            resolve();
          },
          onError: (error: any) => {
            reject(new Error(error.message || "Falha ao atualizar email"));
          },
          onResponse: () => {
            setIsUpdatingEmail(false);
          },
        },
      );
    });
  };

  const handleDeleteAccount = async (password: string) => {
    if (!password) {
      showError("Erro", "Por favor, confirme sua senha");
      return;
    }

    setIsDeletingAccount(true);

    return new Promise<void>((resolve, reject) => {
      authClient.deleteUser(
        { password },
        {
          onSuccess: () => {
            showSuccess("Conta excluída", "Sua conta foi excluída com sucesso");
            setShowDeleteModal(false);
            router.replace("/auth");
            resolve();
          },
          onError: (error: any) => {
            showError("Erro", "Falha ao excluir conta: " + error.message);
            reject(new Error(error.message || "Falha ao excluir conta"));
          },
          onResponse: () => {
            setIsDeletingAccount(false);
          },
        },
      );
    });
  };

  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Por favor, insira um email válido";
    }
    return null;
  };

  const validateName = (name: string): string | null => {
    if (name.length < 2) {
      return "Nome deve ter pelo menos 2 caracteres";
    }
    if (name.length > 50) {
      return "Nome deve ter no máximo 50 caracteres";
    }
    return null;
  };

  return {
    // Session data
    session,

    // Modal state
    showDeleteModal,
    setShowDeleteModal,

    // Loading states
    isUpdatingName,
    isUpdatingEmail,
    isDeletingAccount,

    // Actions
    handleLogout,
    handleUpdateName,
    handleUpdateEmail,
    handleDeleteAccount,

    // Validation
    validateEmail,
    validateName,

    // Alert component
    AlertComponent,
  };
}
