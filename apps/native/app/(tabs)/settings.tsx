import { Container } from "@/components/container";
import { ScrollView, View, Text } from "react-native";
import {
  SettingsHeader,
  EditableField,
  SettingsActions,
  DeleteAccountModal,
} from "@/components/settings";
import { useSettings } from "@/hooks/use-settings";

export default function Settings() {
  const {
    session,
    showDeleteModal,
    setShowDeleteModal,
    isUpdatingName,
    isUpdatingEmail,
    isDeletingAccount,
    handleLogout,
    handleUpdateName,
    handleUpdateEmail,
    handleDeleteAccount,
    validateEmail,
    validateName,
    AlertComponent,
  } = useSettings();

  return (
    <Container>
      <ScrollView className="flex-1">
        <View className="px-6 py-4">
          <SettingsHeader />

          {/* User Info Fields */}
          <View className="mb-8">
            <EditableField
              label="Nome"
              value={session?.user?.name || ""}
              onSave={handleUpdateName}
              isLoading={isUpdatingName}
              placeholder="Seu nome"
              validation={validateName}
            />

            <EditableField
              label="Email"
              value={session?.user?.email || ""}
              onSave={handleUpdateEmail}
              isLoading={isUpdatingEmail}
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              validation={validateEmail}
            />
          </View>

          <SettingsActions
            onLogout={handleLogout}
            onDeleteAccount={() => setShowDeleteModal(true)}
          />
        </View>
      </ScrollView>

      <DeleteAccountModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteAccount}
        isDeleting={isDeletingAccount}
      />
      <AlertComponent />
    </Container>
  );
}
