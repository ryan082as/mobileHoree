import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3F7F2",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  cardWrapper: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
  },

  // Brand Header (Vibrant Green Banner)
  brandHeader: {
    backgroundColor: "#489347",
    borderRadius: 22,
    padding: 22,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#2B5B2A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 5,
  },
  logoBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoImage: {
    width: 90,
    height: 90,
  },
  brandBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 8,
  },
  brandBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  brandTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  brandSubtitle: {
    color: "#E2F2E0",
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 17,
  },

  // Form Card
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#D7E7D4",
    shadowColor: "#2B5B2A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  feedbackBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
    gap: 8,
  },
  errorBox: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  successBox: {
    backgroundColor: "#E9F5E8",
    borderColor: "#C5E6C2",
  },
  feedbackText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 17,
  },
  errorText: {
    color: "#DC2626",
  },
  successText: {
    color: "#2D702C",
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1B331B",
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFCF9",
    borderWidth: 1,
    borderColor: "#D7E7D4",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 14,
    gap: 8,
    height: 48,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: "#1B331B",
  },

  // Submit Button
  submitBtn: {
    backgroundColor: "#489347",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    shadowColor: "#489347",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  submitBtnDisabled: {
    opacity: 0.65,
  },
  submitBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },

  // Switch Mode Button
  switchModeBtn: {
    paddingVertical: 14,
    alignItems: "center",
  },
  switchModeText: {
    fontSize: 12,
    color: "#667D66",
  },
  switchModeHighlight: {
    color: "#489347",
    fontWeight: "bold",
  },

  // Notice Info Box
  noticeBox: {
    backgroundColor: "#EAF5E9",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#C5E6C2",
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 4,
  },
  noticeText: {
    flex: 1,
    fontSize: 11,
    color: "#2D702C",
    lineHeight: 16,
  },
});
