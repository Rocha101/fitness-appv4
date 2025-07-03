import { memo } from "react";
import { View, Text } from "react-native";
import Markdown from "react-native-markdown-display";

export interface ChatMessageProps {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const markdownStyles = {
  body: { color: "#374151", fontSize: 16, lineHeight: 20, flexShrink: 1 },
  strong: { fontWeight: "700" as const },
  em: { fontStyle: "italic" as const },
  code_inline: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: "monospace",
  },
  code_block: {
    backgroundColor: "#f3f4f6",
    padding: 8,
    borderRadius: 4,
    fontFamily: "monospace",
  },
  bullet_list_icon: { color: "#374151" },
};

export const ChatMessage = memo(({ role, content }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <View className={`mb-4 ${isUser ? "items-end" : "items-start"}`}>
      <View
        className={`max-w-[80%] flex-row bg-white px-4 py-3 shadow-sm border border-gray-200 rounded-2xl ${
          isUser ? "rounded-br-md" : "rounded-bl-md"
        }`}
      >
        {isUser ? (
          <Text className="text-base leading-5 text-gray-900 flex-shrink">
            {content}
          </Text>
        ) : (
          <Markdown style={markdownStyles}>{content}</Markdown>
        )}
      </View>
    </View>
  );
});
