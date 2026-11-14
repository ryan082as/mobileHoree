import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    maxWidth: 500,
    width: "100%",
    alignSelf: "center",
  },
  // Top App Bar
  headerContainer: {
    backgroundColor: "#74787C",
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  headerBadge: {
    backgroundColor: "#52B79B",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  headerBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  authButtonsRow: {
    flexDirection: "row",
    gap: 8,
  },
  authBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.35)",
  },
  authBtnText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#F4F4F4",
    marginTop: 2,
  },

  // KPI Summary Cards
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: "#E2E4E6",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3033",
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#74787C",
    marginTop: 2,
    textAlign: "center",
  },

  // Search & Filter Section
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#D8DADE",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#2C3033",
    marginLeft: 8,
  },
  categoryScroll: {
    flexDirection: "row",
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#E2E4E6",
  },
  categoryChipActive: {
    backgroundColor: "#52B79B",
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#74787C",
  },
  categoryChipTextActive: {
    color: "#ffffff",
  },

  // Section Header
  sectionTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3033",
  },
  sectionCount: {
    fontSize: 12,
    color: "#74787C",
  },

  // UMKM Card Styling
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E4E6",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    backgroundColor: "#EAEAEA",
  },
  cardBody: {
    padding: 14,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  businessName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#2C3033",
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    backgroundColor: "#EEF9F5",
    borderColor: "#C1EBDE",
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#3D967D",
  },
  lokasiText: {
    fontSize: 13,
    color: "#74787C",
    marginBottom: 8,
  },
  penilaianRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  penilaianText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C3033",
  },
  ownerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ownerText: {
    fontSize: 13,
    color: "#74787C",
    marginLeft: 4,
  },

  // Score Bar Row
  scoreRow: {
    backgroundColor: "#F4F4F4",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E4E6",
  },
  scoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  scoreLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2C3033",
  },
  scoreBadgeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  scoreBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: "#E2E4E6",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },

  // Info Metrics Grid
  metricsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E4E6",
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 11,
    color: "#74787C",
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2C3033",
  },

  // Compliance Pill List
  complianceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  complianceBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#F4F4F4",
  },
  complianceText: {
    fontSize: 11,
    fontWeight: "500",
    marginLeft: 4,
    color: "#74787C",
  },

  // Recommendation Box
  recommendationBox: {
    backgroundColor: "#EEF9F5",
    borderColor: "#C1EBDE",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  recommendationText: {
    fontSize: 12,
    color: "#28735F",
    lineHeight: 18,
  },

  // Action Buttons inside Card
  cardActionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#52B79B",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 4,
  },

  // Simulation Panel
  simulationBox: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E4E6",
    elevation: 2,
  },
  simulationTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2C3033",
    marginBottom: 4,
  },
  simulationSubtitle: {
    fontSize: 12,
    color: "#74787C",
    marginBottom: 12,
  },
  simInput: {
    borderWidth: 1,
    borderColor: "#D8DADE",
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    marginBottom: 10,
    backgroundColor: "#F4F4F4",
    color: "#2C3033",
  },
  simButton: {
    backgroundColor: "#52B79B",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  simButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 13,
  },
  simResultBox: {
    backgroundColor: "#EEF9F5",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#C1EBDE",
  },
  simResultText: {
    fontSize: 12,
    color: "#28735F",
    fontWeight: "600",
  },

  // Footer Team Member Credits
  footerBox: {
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E4E6",
    marginTop: 8,
  },
  footerText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#74787C",
  },
  footerSubtext: {
    fontSize: 11,
    color: "#9DA1A5",
    marginTop: 2,
  },
});
