import React from "react";
import {
  View,
  Text,
  Image as RNImage,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import tw from "@/app/styles/tailwind";
import { useTheme } from "@/context/ThemeContext";
import { dummyImageUrl } from "@/constants/statics";

interface ImageType {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
  thumbnails: {
    small: {
      url: string;
      width: number;
      height: number;
    };
    large: {
      url: string;
      width: number;
      height: number;
    };
    full: {
      url: string;
      width: number;
      height: number;
    };
  };
}

interface CompactEventCardProps {
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  category: string;
  images: ImageType[];
  onPressShow: () => void;
  style?: any;
  isLoading?: boolean;
  staffOnly?: boolean;
}

const CompactEventCard: React.FC<CompactEventCardProps> = ({
  title,
  date,
  startTime,
  endTime,
  category,
  images,
  onPressShow,
  style,
  isLoading = false,
  staffOnly = false,
}) => {
  const { isDarkMode, colors } = useTheme();
  const imageUrl = images.length > 0 ? images[0].url : dummyImageUrl;

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
    const time = startTime
      ? new Date(startTime).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      : "";

    return { day, month, weekday, time };
  };

  const { day, month, weekday, time } = formatDateTime(date);

  return (
    <Pressable
      onPress={onPressShow}
      style={[
        tw`mx-4 mb-4 rounded-2xl overflow-hidden`,
        {
          backgroundColor: isDarkMode ? colors.lightGray : colors.white,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.12,
          shadowRadius: 16,
          elevation: 12,
        },
        style,
      ]}
      disabled={isLoading}
    >
      {isLoading && (
        <View
          style={tw`absolute z-20 w-full h-full justify-center items-center bg-black/50 rounded-2xl`}
        >
          <ActivityIndicator size='large' color='#ffffff' />
        </View>
      )}

      {/* Background Image with Gradient Overlay */}
      <View style={tw`relative h-52 w-full`}>
        <RNImage
          source={{ uri: imageUrl }}
          style={tw`w-full h-full`}
          resizeMode='cover'
        />

        {/* Dark gradient overlay */}
        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)"]}
          style={tw`absolute inset-0`}
        />

        {/* Top Row - Category and Staff Badge */}
        <View
          style={tw`absolute top-4 left-4 right-4 flex-row justify-between items-start`}
        >
          <View
            style={[
              tw`rounded-full px-3 py-1.5 backdrop-blur`,
              { backgroundColor: "rgba(255,255,255,0.2)" },
            ]}
          >
            <Text style={tw`text-white text-sm font-semibold`}>{category}</Text>
          </View>

          {staffOnly && (
            <View
              style={[
                tw`rounded-full px-3 py-1.5`,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text style={tw`text-white text-sm font-bold`}>STAFF ONLY</Text>
            </View>
          )}
        </View>

        {/* Bottom Content on Image */}
        <View style={tw`absolute bottom-4 left-4 right-4`}>
          <Text
            style={tw`text-white text-2xl font-bold leading-7 mb-2`}
            numberOfLines={2}
          >
            {title}
          </Text>

          {time && (
            <View style={tw`flex-row items-center mb-1`}>
              <FontAwesome name='clock-o' size={16} color='white' />
              <Text style={tw`text-white text-base ml-2 font-medium`}>
                {startTime && endTime
                  ? `${time} - ${new Date(endTime).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}`
                  : time}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Bottom Info Panel */}
      <View style={tw`p-4`}>
        <View style={tw`flex-row items-center justify-between`}>
          <View style={tw`flex-row items-center`}>
            <View
              style={[
                tw`rounded-xl p-3 mr-3`,
                {
                  backgroundColor: isDarkMode
                    ? colors.background
                    : colors.lightGray,
                },
              ]}
            >
              <Text
                style={[
                  tw`text-2xl font-bold text-center`,
                  { color: colors.primary },
                ]}
              >
                {day}
              </Text>
              <Text
                style={[
                  tw`text-xs font-semibold text-center mt-1`,
                  { color: colors.text },
                ]}
              >
                {month.toUpperCase()}
              </Text>
            </View>

            <View>
              <Text style={[tw`text-lg font-bold`, { color: colors.text }]}>
                {weekday}
              </Text>
              <Text style={[tw`text-sm`, { color: colors.gray }]}>
                {new Date(date).getFullYear()}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              tw`rounded-full w-12 h-12 justify-center items-center`,
              { backgroundColor: colors.primary },
            ]}
          >
            <FontAwesome name='arrow-right' size={18} color='white' />
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
};

export default CompactEventCard;
