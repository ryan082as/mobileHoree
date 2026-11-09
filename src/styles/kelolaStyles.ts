import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    padding: 16,
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
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3033",
  },
  subtitle: {
    fontSize: 12,
    color: "#74787C",
    marginTop: 2,
  },
  loadingBox: {
    padding: 40,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#74787C",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E4E6",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2C3033",
  },
  itemSub: {
    fontSize: 12,
    color: "#74787C",
    marginTop: 2,
  },
  actionBtns: {
    flexDirection: "row",
    gap: 8,
  },
  editBtn: {
    backgroundColor: "#52B79B",
    padding: 8,
    borderRadius: 8,
  },
  delBtn: {
    backgroundColor: "#ef4444",
    padding: 8,
    borderRadius: 8,
  },
});
