import React from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface MenuPaginationBarProps {
  searchQuery: string;
  onChangeSearch: (q: string) => void;
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  loading?: boolean;
  onPageChange: (nextPage: number) => void;
}

/**
 * Shared search input and pagination controls for large store menu lists (10,000+ rows).
 */
export function MenuPaginationBar({
  searchQuery,
  onChangeSearch,
  page,
  pageSize,
  totalCount,
  totalPages,
  loading = false,
  onPageChange,
}: MenuPaginationBarProps) {
  const startIdx = totalCount === 0 ? 0 : page * pageSize + 1;
  const endIdx = Math.min((page + 1) * pageSize, totalCount);
  const canPrev = page > 0 && !loading;
  const canNext = page + 1 < totalPages && !loading;

  return (
    <View style={{ marginBottom: 10 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#F8FAF9",
          borderWidth: 1,
          borderColor: "#D7E7D4",
          borderRadius: 8,
          paddingHorizontal: 10,
          marginBottom: 8,
        }}
      >
        <Ionicons name="search" size={15} color="#667D66" />
        <TextInput
          style={{
            flex: 1,
            paddingVertical: 7,
            paddingHorizontal: 8,
            fontSize: 12,
            color: "#1B331B",
          }}
          placeholder="Cari nama menu (mis. #09999)..."
          placeholderTextColor="#94A894"
          value={searchQuery}
          onChangeText={onChangeSearch}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => onChangeSearch("")}>
            <Ionicons name="close-circle" size={16} color="#667D66" />
          </Pressable>
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 6,
          backgroundColor: "#F8FAF9",
          borderRadius: 8,
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderWidth: 1,
          borderColor: "#EEF2F3",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          {loading && <ActivityIndicator size="small" color="#489347" />}
          <Text style={{ fontSize: 11, color: "#4A6E4A", fontWeight: "600" }}>
            {startIdx.toLocaleString("id-ID")}–{endIdx.toLocaleString("id-ID")} dari{" "}
            {totalCount.toLocaleString("id-ID")} menu
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Pressable
            onPress={() => onPageChange(0)}
            disabled={!canPrev}
            style={{
              paddingHorizontal: 6,
              paddingVertical: 4,
              borderRadius: 6,
              backgroundColor: canPrev ? "#E9F5E8" : "#F1F5F9",
              opacity: canPrev ? 1 : 0.45,
            }}
          >
            <Ionicons name="play-skip-back" size={12} color="#489347" />
          </Pressable>

          <Pressable
            onPress={() => onPageChange(page - 1)}
            disabled={!canPrev}
            style={{
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6,
              backgroundColor: canPrev ? "#E9F5E8" : "#F1F5F9",
              opacity: canPrev ? 1 : 0.45,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: "700", color: "#489347" }}>Prev</Text>
          </Pressable>

          <Text style={{ fontSize: 11, color: "#1B331B", fontWeight: "700", paddingHorizontal: 4 }}>
            {page + 1}/{totalPages}
          </Text>

          <Pressable
            onPress={() => onPageChange(page + 1)}
            disabled={!canNext}
            style={{
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6,
              backgroundColor: canNext ? "#E9F5E8" : "#F1F5F9",
              opacity: canNext ? 1 : 0.45,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: "700", color: "#489347" }}>Next</Text>
          </Pressable>

          <Pressable
            onPress={() => onPageChange(totalPages - 1)}
            disabled={!canNext}
            style={{
              paddingHorizontal: 6,
              paddingVertical: 4,
              borderRadius: 6,
              backgroundColor: canNext ? "#E9F5E8" : "#F1F5F9",
              opacity: canNext ? 1 : 0.45,
            }}
          >
            <Ionicons name="play-skip-forward" size={12} color="#489347" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
