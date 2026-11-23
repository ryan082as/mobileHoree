import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },
  content: {
    padding: 16,
    maxWidth: 500,
    alignSelf: "center",
    width: "100%",
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 6,
  },
  backText: {
    color: "#52B79B",
    fontWeight: "600",
    fontSize: 14,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E4E6",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3033",
  },
  desc: {
    fontSize: 12,
    color: "#74787C",
    marginTop: 4,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2C3033",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E4E6",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 16,
    backgroundColor: "#F9F9F9",
    color: "#2C3033",
  },
  submitBtn: {
    backgroundColor: "#52B79B",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  submitBtnText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
