import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    padding: 20,
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 6,
  },
  backText: {
    color: "#52B79B",
    fontWeight: "600",
    fontSize: 14,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E4E6",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#1E6B56",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3033",
  },
  role: {
    fontSize: 13,
    color: "#52B79B",
    fontWeight: "600",
    marginTop: 2,
  },
  email: {
    fontSize: 12,
    color: "#74787C",
    marginTop: 4,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 20,
  },
  logoutBtn: {
    flexDirection: "row",
    backgroundColor: "#ef4444",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    gap: 8,
  },
  logoutText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
