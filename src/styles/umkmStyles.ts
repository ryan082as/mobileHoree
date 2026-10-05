import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  // Top App Bar
  headerContainer: {
    backgroundColor: "#1e3a8a",
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  headerBadge: {
    backgroundColor: "#3b82f6",
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
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
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
    color: "#cbd5e1",
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
    borderColor: "#e2e8f0",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 2,
    textAlign: "center",
  },

  // Search & Filter Section
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1e293b",
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
    backgroundColor: "#e2e8f0",
  },
  categoryChipActive: {
    backgroundColor: "#2563eb",
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
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
    color: "#0f172a",
  },
  sectionCount: {
    fontSize: 12,
    color: "#64748b",
  },

  // UMKM Card Styling
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 140,
    backgroundColor: "#e2e8f0",
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
    color: "#0f172a",
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    backgroundColor: "#eff6ff",
    borderColor: "#bfdbfe",
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#2563eb",
  },
  lokasiText: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 8,
  },
  penilaianRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  penilaianText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
  },
  ownerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ownerText: {
    fontSize: 13,
    color: "#64748b",
    marginLeft: 4,
  },

  // Score Bar Row
  scoreRow: {
    backgroundColor: "#f8fafc",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
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
    color: "#334155",
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
    backgroundColor: "#e2e8f0",
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
    borderBottomColor: "#f1f5f9",
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 11,
    color: "#94a3b8",
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1e293b",
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
    backgroundColor: "#f1f5f9",
  },
  complianceText: {
    fontSize: 11,
    fontWeight: "500",
    marginLeft: 4,
    color: "#475569",
  },

  // Recommendation Box
  recommendationBox: {
    backgroundColor: "#f0fdf4",
    borderColor: "#bbf7d0",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  recommendationText: {
    fontSize: 12,
    color: "#166534",
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
    backgroundColor: "#2563eb",
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
    borderColor: "#e2e8f0",
    elevation: 2,
  },
  simulationTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  simulationSubtitle: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 12,
  },
  simInput: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    marginBottom: 10,
    backgroundColor: "#f8fafc",
  },
  simButton: {
    backgroundColor: "#059669",
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
    backgroundColor: "#ecfdf5",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },
  simResultText: {
    fontSize: 12,
    color: "#065f46",
    fontWeight: "600",
  },

  // Footer Team Member Credits
  footerBox: {
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    marginTop: 8,
  },
  footerText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#64748b",
  },
  footerSubtext: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 2,
  },
});
