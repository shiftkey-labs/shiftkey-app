import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "../styles/tailwind";
import { useTheme } from "@/context/ThemeContext";
import { observer } from "@legendapp/state/react";
import {
  getAvailableShifts,
  getBookedShifts,
  getPastShifts,
  getShiftById,
  claimShift,
} from "@/api/shiftApi";
import state from "@/state";

type ShiftTab = "available" | "booked" | "past";

interface ShiftRecord {
  id: string;
  title: string;
  location?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  status?: string | null;
  eventId?: string | null;
}

type ShiftState = Record<
  ShiftTab,
  {
    items: ShiftRecord[];
    loaded: boolean;
  }
>;

const TAB_ORDER: Array<{ key: ShiftTab; label: string }> = [
  { key: "available", label: "Available" },
  { key: "booked", label: "Booked" },
  { key: "past", label: "Past" },
];

const emptyShiftState: ShiftState = {
  available: { items: [], loaded: false },
  booked: { items: [], loaded: false },
  past: { items: [], loaded: false },
};

const safeDate = (value?: string | null) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const formatShiftWindow = (start?: string | null, end?: string | null) => {
  const parsedStart = safeDate(start);
  const parsedEnd = safeDate(end);

  if (parsedStart && parsedEnd) {
    return `${parsedStart.toLocaleString()} - ${parsedEnd.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    })}`;
  }

  if (parsedStart) {
    return parsedStart.toLocaleString();
  }

  if (parsedEnd) {
    return parsedEnd.toLocaleString();
  }

  return "Schedule pending";
};

const normaliseShiftData = (payload: any): ShiftRecord[] => {
  const candidates = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.records)
    ? payload.records
    : Array.isArray(payload?.shifts)
    ? payload.shifts
    : [];

  return candidates
    .map((item) => ({
      id: String(
        item?.id ??
          item?.shiftId ??
          item?.eventId ??
          item?.recordId ??
          `${Math.random()}`
      ),
      title:
        item?.title ??
        item?.name ??
        item?.eventName ??
        item?.shiftName ??
        "Shift",
      location: item?.location ?? item?.venue ?? null,
      startDate: item?.startDate ?? item?.start_time ?? item?.start ?? null,
      endDate: item?.endDate ?? item?.end_time ?? item?.end ?? null,
      status: item?.status ?? item?.shiftStatus ?? null,
      eventId: item?.eventId ?? item?.event_id ?? null,
    }))
    .filter((item: ShiftRecord) => item.id);
};

const MyShifts = observer(() => {
  const { isDarkMode, colors } = useTheme();
  const [activeTab, setActiveTab] = useState<ShiftTab>("available");
  const [shifts, setShifts] = useState<ShiftState>(emptyShiftState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingShiftId, setLoadingShiftId] = useState<string | null>(null);
  const [claimingShiftId, setClaimingShiftId] = useState<string | null>(null);
  const user = state.user.userState.get();
  const userId = user?.id ? String(user.id) : null;

  const fetchShiftsForTab = useCallback(
    async (tab: ShiftTab) => {
      if ((tab === "booked" || tab === "past") && !userId) {
        setShifts((prev) => ({
          ...prev,
          [tab]: { items: [], loaded: true },
        }));
        return;
      }

      setIsLoading(true);

      try {
        let response: any;

        if (tab === "available") {
          response = await getAvailableShifts();
        } else if (tab === "booked") {
          response = await getBookedShifts(userId!);
        } else {
          response = await getPastShifts(userId!);
        }

        const normalised = normaliseShiftData(response);

        setShifts((prev) => ({
          ...prev,
          [tab]: {
            items: normalised,
            loaded: true,
          },
        }));
      } catch (error: any) {
        const status =
          error?.status ??
          error?.response?.status ??
          error?.response?.statusCode ??
          null;

        if (status === 302) {
          // 302 just means no data, not an error
          setShifts((prev) => ({
            ...prev,
            [tab]: { items: [], loaded: true },
          }));
        } else {
          // Actual error - log it but don't show error banner
          console.error(`Failed to load ${tab} shifts:`, error);
          setShifts((prev) => ({
            ...prev,
            [tab]: { items: [], loaded: true },
          }));
        }
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  const handleClaimShift = useCallback(
    async (shift: ShiftRecord) => {
      if (!shift?.id) {
        Alert.alert("Error", "Unable to identify this shift.");
        return;
      }

      if (!userId) {
        Alert.alert(
          "Sign In Required",
          "Please sign in to take this shift."
        );
        return;
      }

      if (claimingShiftId) {
        return;
      }

      try {
        setClaimingShiftId(shift.id);
        await claimShift(shift.id, userId);
        Alert.alert("Shift Booked", "You have successfully taken this shift.");

        setShifts((prev) => ({
          ...prev,
          available: {
            ...prev.available,
            items: prev.available.items.filter((item) => item.id !== shift.id),
            loaded: prev.available.loaded,
          },
        }));

        await fetchShiftsForTab("available");
      } catch (error: any) {
        console.error("Failed to take shift:", error);
        const message =
          error?.message ?? "Failed to take the shift. Please try again.";
        Alert.alert("Error", message);
      } finally {
        setClaimingShiftId(null);
      }
    },
    [claimingShiftId, fetchShiftsForTab, userId]
  );

  const handleSelectShift = useCallback(
    async (shift: ShiftRecord) => {
      if (activeTab !== "available") {
        return;
      }

      if (!shift?.id) {
        Alert.alert("Error", "Unable to identify this shift.");
        return;
      }

      if (!userId) {
        Alert.alert(
          "Sign In Required",
          "Please sign in to take this shift."
        );
        return;
      }

      let details: any = null;
      try {
        setLoadingShiftId(shift.id);
        details = await getShiftById(shift.id);
      } catch (error: any) {
        console.error("Failed to load shift details:", error);
        const message =
          error?.message ??
          "Unable to load shift details. Please try again.";
        Alert.alert("Error", message);
        return;
      } finally {
        setLoadingShiftId(null);
      }

      if (!details) {
        Alert.alert(
          "Shift Unavailable",
          "This shift is no longer available to take."
        );
        return;
      }

      Alert.alert(
        "Take Shift",
        `Do you want to take "${shift.title}"?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Confirm",
            onPress: () => handleClaimShift(shift),
          },
        ],
        { cancelable: true }
      );
    },
    [activeTab, handleClaimShift, userId]
  );

  useEffect(() => {
    fetchShiftsForTab(activeTab);
  }, [activeTab, fetchShiftsForTab]);

  const activeShifts = shifts[activeTab]?.items ?? [];
  const activeTabLabel =
    TAB_ORDER.find((tab) => tab.key === activeTab)?.label ?? "Available";

  const renderShiftRow = useCallback(
    ({ item }: { item: ShiftRecord }) => {
      const schedule = formatShiftWindow(item.startDate, item.endDate);
      const isProcessing =
        loadingShiftId === item.id || claimingShiftId === item.id;
      const isAvailableTab = activeTab === "available";

      return (
        <TouchableOpacity
          activeOpacity={isAvailableTab ? 0.7 : 1}
          disabled={!isAvailableTab || isProcessing}
          onPress={() => handleSelectShift(item)}
          style={tw`mb-3`}
        >
          <View
            style={[
              tw`p-4 rounded-xl`,
              {
                backgroundColor: isDarkMode ? colors.lightGray : colors.white,
              },
            ]}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 18,
                fontWeight: "600",
              }}
            >
              {item.title}
            </Text>
            <Text style={{ color: colors.gray, marginTop: 6 }}>{schedule}</Text>
            {item.location ? (
              <Text style={{ color: colors.gray, marginTop: 4 }}>
                {item.location}
              </Text>
            ) : null}
            {item.status ? (
              <View
                style={[
                  tw`self-start px-3 py-1 rounded-full mt-4`,
                  {
                    backgroundColor: colors.primary,
                  },
                ]}
              >
                <Text style={{ color: colors.white, fontSize: 12 }}>
                  {item.status}
                </Text>
              </View>
            ) : null}
            {isProcessing ? (
              <View style={tw`flex-row items-center mt-4`}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={{ color: colors.gray, marginLeft: 8 }}>
                  {claimingShiftId === item.id
                    ? "Booking shift..."
                    : "Loading shift..."}
                </Text>
              </View>
            ) : null}
          </View>
        </TouchableOpacity>
      );
    },
    [activeTab, claimingShiftId, colors, handleSelectShift, isDarkMode, loadingShiftId]
  );

  const keyExtractor = useCallback((item: ShiftRecord) => item.id, []);

  return (
    <SafeAreaView
      style={[tw`flex-1`, { backgroundColor: colors.background, padding: 20 }]}
    >
      <View style={tw`flex-1`}>
        <Text
          style={{
            color: colors.text,
            fontSize: 30,
            fontWeight: "bold",
            marginBottom: 20,
          }}
        >
          My Shifts
        </Text>

        <View style={tw`flex-row mb-5`}>
          {TAB_ORDER.map(({ key, label }) => {
            const isActive = activeTab === key;
            return (
              <TouchableOpacity
                key={key}
                style={[
                  tw`flex-1 p-3 rounded-full`,
                  key === "available" ? tw`mr-2` : key === "past" ? tw`ml-2` : tw`mx-1`,
                  isActive
                    ? { backgroundColor: colors.primary }
                    : {
                        backgroundColor: isDarkMode
                          ? colors.lightGray
                          : colors.white,
                      },
                ]}
                onPress={() => setActiveTab(key)}
                disabled={isLoading && isActive}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: isActive ? colors.white : colors.gray,
                    fontWeight: "600",
                  }}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <FlatList
          data={activeShifts}
          keyExtractor={keyExtractor}
          renderItem={renderShiftRow}
          contentContainerStyle={tw`pb-10`}
          refreshing={isLoading}
          onRefresh={() => fetchShiftsForTab(activeTab)}
          ListEmptyComponent={
            <View
              style={[
                tw`flex-1 items-center justify-center pt-20`,
                { backgroundColor: colors.background },
              ]}
            >
              <Text
                style={{
                  color: colors.text,
                  fontSize: 22,
                  fontWeight: "600",
                  marginBottom: 8,
                }}
              >
                No {activeTabLabel} Shifts
              </Text>
              <Text style={{ color: colors.gray }}>
                You do not have any {activeTabLabel.toLowerCase()} shifts yet.
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
});

export default MyShifts;
