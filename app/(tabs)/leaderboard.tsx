import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  Alert,
} from "react-native";
import { Stack } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import tw from "../styles/tailwind";
import server from "@/config/axios";
import { useTheme } from "@/context/ThemeContext";

interface LeaderboardEntry {
  id: string;
  firstName: string;
  lastName: string;
  attendanceDays: number;
  rank: number;
}

interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  generatedAt: string;
  period: string;
}

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState("");
  const { isDarkMode, colors } = useTheme();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await server.get<LeaderboardResponse>("/registration/leaderboard");
      setLeaderboard(response.data.leaderboard);
      setPeriod(response.data.period);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      Alert.alert("Error", "Failed to fetch leaderboard data.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLeaderboard();
    setRefreshing(false);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "#FFD700"; // Gold
      case 2:
        return "#C0C0C0"; // Silver
      case 3:
        return "#CD7F32"; // Bronze
      default:
        return colors.text;
    }
  };

  const renderLeaderboardItem = ({ item }: { item: LeaderboardEntry }) => (
    <View
      style={[
        tw`flex-row items-center justify-between p-4 mb-3 rounded-xl shadow-sm`,
        {
          backgroundColor: isDarkMode ? colors.lightGray : colors.white,
          borderLeftWidth: item.rank <= 3 ? 4 : 0,
          borderLeftColor: getRankColor(item.rank),
        },
      ]}
    >
      <View style={tw`flex-row items-center flex-1`}>
        {/* Rank */}
        <View
          style={[
            tw`w-12 h-12 rounded-full justify-center items-center mr-4`,
            {
              backgroundColor: item.rank <= 3 ? `${getRankColor(item.rank)}20` : colors.background,
            },
          ]}
        >
          <Text
            style={[
              tw`font-bold text-lg`,
              {
                color: getRankColor(item.rank),
                fontSize: item.rank <= 3 ? 20 : 16,
              },
            ]}
          >
            {item.rank <= 3 ? getRankIcon(item.rank) : `#${item.rank}`}
          </Text>
        </View>

        {/* User Info */}
        <View style={tw`flex-1`}>
          <Text
            style={[
              tw`text-lg font-semibold`,
              {
                color: colors.text,
              },
            ]}
          >
            {item.firstName} {item.lastName}
          </Text>
          <Text
            style={[
              tw`text-sm mt-1`,
              {
                color: colors.gray,
              },
            ]}
          >
            {item.attendanceDays} attendance day{item.attendanceDays !== 1 ? "s" : ""}
          </Text>
        </View>

        {/* Attendance Days Count Badge */}
        <View
          style={[
            tw`px-3 py-2 rounded-full`,
            {
              backgroundColor: colors.primary + "20",
            },
          ]}
        >
          <Text
            style={[
              tw`text-sm font-bold`,
              {
                color: colors.primary,
              },
            ]}
          >
            {item.attendanceDays}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View
        style={[
          tw`flex-1 justify-center items-center`,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={isDarkMode ? colors.text : colors.primary}
        />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[
        tw`flex-1`,
        { backgroundColor: isDarkMode ? colors.lightGray : colors.white },
      ]}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      {/* Header */}
      <View
        style={[
          tw`px-6 py-4 shadow-sm`,
          { backgroundColor: isDarkMode ? colors.lightGray : colors.white },
        ]}
      >
        <View style={tw`flex-row items-center justify-center mb-2`}>
          <AntDesign name="Trophy" size={28} color={colors.primary} />
          <Text
            style={[
              tw`text-2xl font-bold ml-3`,
              { color: colors.text },
            ]}
          >
            Leaderboard
          </Text>
        </View>
        <Text
          style={[
            tw`text-sm text-center`,
            { color: colors.gray },
          ]}
        >
          Top Students by Attendance Days
        </Text>
        {period && (
          <Text
            style={[
              tw`text-xs text-center mt-1`,
              { color: colors.gray },
            ]}
          >
            {period}
          </Text>
        )}
      </View>

      <View style={[tw`flex-1 px-4 py-2`, { backgroundColor: colors.background }]}>
        {leaderboard.length > 0 ? (
          <FlatList
            data={leaderboard}
            renderItem={renderLeaderboardItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
              />
            }
            contentContainerStyle={tw`pb-6`}
          />
        ) : (
          <View style={tw`flex-1 justify-center items-center`}>
            <AntDesign name="Trophy" size={64} color={colors.gray} />
            <Text
              style={[
                tw`text-lg font-semibold mt-4`,
                { color: colors.text },
              ]}
            >
              No Data Available
            </Text>
            <Text
              style={[
                tw`text-sm text-center mt-2 px-8`,
                { color: colors.gray },
              ]}
            >
              The leaderboard will show top students once attendance day data is available.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Leaderboard;