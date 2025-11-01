import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "../styles/tailwind";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { inviteVolunteer } from "@/api/volunteerApi";
import { Alert } from "@/utils/alert";
import DateTimePicker from "@react-native-community/datetimepicker";

type InviteStep = 1 | 2 | 3 | 4; // 1: Email, 2: Name (if needed), 3: Expiration, 4: Success

const InviteVolunteer = () => {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();

  const [currentStep, setCurrentStep] = useState<InviteStep>(1);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inviteResponse, setInviteResponse] = useState<any>(null);
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");

  const handleStep1Submit = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter an email address");
      return;
    }

    // Simple email validation - must contain @ and a dot after @
    const trimmedEmail = email.trim();
    if (!trimmedEmail.includes('@') || !trimmedEmail.split('@')[1]?.includes('.')) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const response = await inviteVolunteer({ email: email.trim() });

      if (response.success) {
        if (response.userExists) {
          // User exists, store their name and go to expiration date
          setUserFirstName(response.firstName || "");
          setUserLastName(response.lastName || "");
          setCurrentStep(3);
        } else {
          // User doesn't exist, need to collect first and last name
          setCurrentStep(2);
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Error", "Please enter both first and last name");
      return;
    }

    setUserFirstName(firstName.trim());
    setUserLastName(lastName.trim());
    setCurrentStep(3);
  };

  const handleStep3Submit = async () => {
    setLoading(true);
    try {
      const formattedDate = expirationDate.toISOString().split('T')[0]; // YYYY-MM-DD

      const payload: any = {
        email: email.trim(),
        expiresAt: formattedDate,
        sendInvitationEmail: sendEmail,
      };

      // Add firstName and lastName if they were collected
      if (userFirstName && userLastName) {
        payload.firstName = userFirstName.trim();
        payload.lastName = userLastName.trim();
      }

      const response = await inviteVolunteer(payload);

      if (response.success) {
        setInviteResponse(response);
        setCurrentStep(4);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setExpirationDate(selectedDate);
    }
  };

  const handleFinish = () => {
    router.back();
  };

  const renderProgressIndicator = () => {
    const totalSteps = 3;
    const activeStep = currentStep === 4 ? 3 : currentStep;

    return (
      <View style={tw`flex-row items-center justify-center mb-6`}>
        {[1, 2, 3].map((step, index) => (
          <React.Fragment key={step}>
            <View
              style={[
                tw`w-8 h-8 rounded-full items-center justify-center`,
                {
                  backgroundColor: step <= activeStep ? colors.primary : colors.gray,
                },
              ]}
            >
              <Text style={{ color: colors.white, fontWeight: "600" }}>
                {step}
              </Text>
            </View>
            {index < totalSteps - 1 && (
              <View
                style={[
                  tw`h-1 flex-1 mx-2`,
                  {
                    backgroundColor: step < activeStep ? colors.primary : colors.gray,
                  },
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>
    );
  };

  const renderStep1 = () => (
    <View>
      <Text style={{ color: colors.text, fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
        Enter Email
      </Text>
      <Text style={{ color: colors.gray, marginBottom: 24 }}>
        Provide the email address of the person you want to invite
      </Text>

      <View style={tw`mb-4`}>
        <Text style={{ color: colors.text, marginBottom: 8 }}>Email Address</Text>
        <TextInput
          style={[
            tw`p-3 rounded-lg`,
            {
              backgroundColor: isDarkMode ? colors.lightGray : colors.white,
              color: colors.text,
              borderWidth: 1,
              borderColor: colors.gray,
            },
          ]}
          placeholder="staff@dal.ca"
          placeholderTextColor={colors.gray}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <TouchableOpacity
        style={[
          tw`p-4 rounded-lg mt-4`,
          { backgroundColor: loading ? colors.gray : colors.primary },
        ]}
        onPress={handleStep1Submit}
        disabled={loading}
      >
        <Text style={{ color: colors.white, textAlign: "center", fontWeight: "600" }}>
          {loading ? "Checking..." : "Next"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={{ color: colors.text, fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
        New User Information
      </Text>
      <Text style={{ color: colors.gray, marginBottom: 24 }}>
        This user doesn't exist yet. Please provide their details.
      </Text>

      <View style={tw`mb-4`}>
        <Text style={{ color: colors.text, marginBottom: 8 }}>First Name</Text>
        <TextInput
          style={[
            tw`p-3 rounded-lg`,
            {
              backgroundColor: isDarkMode ? colors.lightGray : colors.white,
              color: colors.text,
              borderWidth: 1,
              borderColor: colors.gray,
            },
          ]}
          placeholder="John"
          placeholderTextColor={colors.gray}
          value={firstName}
          onChangeText={setFirstName}
        />
      </View>

      <View style={tw`mb-4`}>
        <Text style={{ color: colors.text, marginBottom: 8 }}>Last Name</Text>
        <TextInput
          style={[
            tw`p-3 rounded-lg`,
            {
              backgroundColor: isDarkMode ? colors.lightGray : colors.white,
              color: colors.text,
              borderWidth: 1,
              borderColor: colors.gray,
            },
          ]}
          placeholder="Doe"
          placeholderTextColor={colors.gray}
          value={lastName}
          onChangeText={setLastName}
        />
      </View>

      <TouchableOpacity
        style={[tw`p-4 rounded-lg mt-4`, { backgroundColor: colors.primary }]}
        onPress={handleStep2Submit}
      >
        <Text style={{ color: colors.white, textAlign: "center", fontWeight: "600" }}>
          Next
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[tw`p-4 rounded-lg mt-2`]}
        onPress={() => setCurrentStep(1)}
      >
        <Text style={{ color: colors.primary, textAlign: "center", fontWeight: "600" }}>
          Back
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={{ color: colors.text, fontSize: 20, fontWeight: "bold", marginBottom: 8 }}>
        Set how long {userFirstName} {userLastName} should have access to the app
      </Text>
      <Text style={{ color: colors.gray, marginBottom: 24 }}>
        Choose the expiration date for this volunteer's access
      </Text>

      <View style={tw`mb-4`}>
        <Text style={{ color: colors.text, marginBottom: 8 }}>Expiration Date</Text>
        <TouchableOpacity
          style={[
            tw`p-3 rounded-lg`,
            {
              backgroundColor: isDarkMode ? colors.lightGray : colors.white,
              borderWidth: 1,
              borderColor: colors.gray,
            },
          ]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: colors.text }}>
            {expirationDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={expirationDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>

      <View style={[tw`flex-row items-center justify-between mb-4 p-3 rounded-lg`, {
        backgroundColor: isDarkMode ? colors.lightGray : colors.white,
      }]}>
        <Text style={{ color: colors.text }}>Send invitation email</Text>
        <Switch
          value={sendEmail}
          onValueChange={setSendEmail}
          trackColor={{ false: colors.gray, true: colors.primary }}
          thumbColor={sendEmail ? colors.white : colors.lightGray}
          ios_backgroundColor={colors.gray}
        />
      </View>

      <TouchableOpacity
        style={[
          tw`p-4 rounded-lg mt-4`,
          { backgroundColor: loading ? colors.gray : colors.primary },
        ]}
        onPress={handleStep3Submit}
        disabled={loading}
      >
        <Text style={{ color: colors.white, textAlign: "center", fontWeight: "600" }}>
          {loading ? "Inviting..." : "Send Invitation"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[tw`p-4 rounded-lg mt-2`]}
        onPress={() => setCurrentStep(firstName && lastName ? 2 : 1)}
      >
        <Text style={{ color: colors.primary, textAlign: "center", fontWeight: "600" }}>
          Back
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep4 = () => (
    <View style={tw`items-center`}>
      <View
        style={[
          tw`w-20 h-20 rounded-full items-center justify-center mb-4`,
          { backgroundColor: colors.secondary },
        ]}
      >
        <Text style={{ color: colors.white, fontSize: 40 }}>✓</Text>
      </View>

      <Text style={{ color: colors.text, fontSize: 24, fontWeight: "bold", marginBottom: 8 }}>
        Invitation Sent!
      </Text>

      {inviteResponse && (
        <View
          style={[
            tw`w-full p-4 rounded-lg mb-4`,
            { backgroundColor: isDarkMode ? colors.lightGray : colors.white },
          ]}
        >
          <View style={tw`mb-2`}>
            <Text style={{ color: colors.gray, fontSize: 12 }}>Email</Text>
            <Text style={{ color: colors.text, fontWeight: "600" }}>
              {inviteResponse.email}
            </Text>
          </View>

          <View style={tw`mb-2`}>
            <Text style={{ color: colors.gray, fontSize: 12 }}>Role</Text>
            <Text style={{ color: colors.text, fontWeight: "600" }}>
              {inviteResponse.role}
            </Text>
          </View>

          <View style={tw`mb-2`}>
            <Text style={{ color: colors.gray, fontSize: 12 }}>Access Expires</Text>
            <Text style={{ color: colors.text, fontWeight: "600" }}>
              {inviteResponse.expiresAt}
            </Text>
          </View>

          <View>
            <Text style={{ color: colors.gray, fontSize: 12 }}>Email Sent</Text>
            <Text style={{ color: colors.text, fontWeight: "600" }}>
              {inviteResponse.emailSent ? "Yes" : "No"}
            </Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[tw`p-4 rounded-lg mt-4 w-full`, { backgroundColor: colors.primary }]}
        onPress={handleFinish}
      >
        <Text style={{ color: colors.white, textAlign: "center", fontWeight: "600" }}>
          Done
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: colors.background }]}>
      <ScrollView style={[tw`flex-1 px-5`, { backgroundColor: colors.background }]}>
        {currentStep !== 4 && renderProgressIndicator()}

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default InviteVolunteer;
