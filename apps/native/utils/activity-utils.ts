export const getActivityEmoji = (name: string): string => {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes("corrida") || lowercaseName.includes("correr"))
    return "🏃";
  if (lowercaseName.includes("natação") || lowercaseName.includes("nadar"))
    return "🏊";
  if (
    lowercaseName.includes("musculação") ||
    lowercaseName.includes("academia")
  )
    return "🏋️";
  if (lowercaseName.includes("ciclismo") || lowercaseName.includes("bike"))
    return "🚴";
  if (lowercaseName.includes("yoga")) return "🧘";
  if (lowercaseName.includes("futebol")) return "⚽";
  return "💪"; // default emoji
};
