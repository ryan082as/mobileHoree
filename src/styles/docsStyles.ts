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
    marginTop: 4,
  },
  kategoriChip: {
    backgroundColor: "#E6F4F1",
    borderColor: "#B8E3D8",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginTop: 6,
    marginBottom: 6,
  },
  kategoriText: {
    fontSize: 12,
    color: "#1E6B56",
    fontWeight: "600",
  },
  ringkasan: {
    fontSize: 13,
    color: "#74787C",
    marginVertical: 12,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2C3033",
    marginTop: 8,
    marginBottom: 8,
  },
  poinItem: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E4E6",
    gap: 8,
  },
  poinBullet: {
    fontSize: 14,
    color: "#52B79B",
    fontWeight: "bold",
  },
  poinText: {
    fontSize: 13,
    color: "#2C3033",
    flex: 1,
    lineHeight: 18,
  },
});
