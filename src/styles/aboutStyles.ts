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
  headerCard: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E4E6",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3033",
    marginTop: 8,
  },
  version: {
    fontSize: 12,
    color: "#74787C",
    marginTop: 4,
    textAlign: "center",
  },
  desc: {
    fontSize: 13,
    color: "#74787C",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 18,
  },
  sectionCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E4E6",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2C3033",
    marginBottom: 12,
  },
  memberItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E4E6",
  },
  memberName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2C3033",
  },
  memberNim: {
    fontSize: 12,
    color: "#74787C",
    marginTop: 2,
  },
  backBtn: {
    flexDirection: "row",
    backgroundColor: "#52B79B",
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  backBtnText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
