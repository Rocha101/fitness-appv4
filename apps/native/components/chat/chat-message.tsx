import { memo } from "react";
import { View, Text } from "react-native";
import Markdown from "react-native-markdown-display";

export interface ChatMessageProps {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const markdownStyles = {
  body: { color: "#374151", fontSize: 16, lineHeight: 20 },
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
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${isUser ? "bg-black rounded-br-md" : "bg-gray-100 rounded-bl-md"}`}
      >
        {isUser ? (
          <Text className="text-base leading-5 text-white">{content}</Text>
        ) : (
          <Markdown style={markdownStyles}>{content}</Markdown>
        )}
      </View>
    </View>
  );
});
