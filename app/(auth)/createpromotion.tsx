import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/constants/ThemeCheck";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function CreatePromotions() {
  const theme = useTheme();

  const [startDateTime, setStartDateTime] = useState<Date | null>(null);
  const [endDateTime, setEndDateTime] = useState<Date | null>(null);

  const [isPickerVisible, setPickerVisible] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<"start" | "end" | null>(null);
  const [pickerTempValue, setPickerTempValue] = useState(new Date());

  const handleImageUpload = () => {
  }

  const openDateTimePicker = (target: "start" | "end") => {
    setPickerTarget(target);
    const value = target === "start" ? startDateTime : endDateTime;
    setPickerTempValue(value || new Date());
    setPickerVisible(true);
  };

  const handleDateTimeConfirm = (date: Date) => {
    if (pickerTarget === "start") {
      if (endDateTime && date > endDateTime) {
        Alert.alert("Invalid Start", "Start must be before End");
      } else {
        setStartDateTime(date);
      }
    } else if (pickerTarget === "end") {
      if (startDateTime && date < startDateTime) {
        Alert.alert("Invalid End", "End must be after Start");
      } else {
        setEndDateTime(date);
      }
    }
    setPickerVisible(false);
    setPickerTarget(null);
  };

  const format = (date: Date | null) =>
    date
      ? date.toLocaleString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      : "Select";

  const validateDateRange = () => {
    if (startDateTime && endDateTime && startDateTime >= endDateTime) {
      Alert.alert("Invalid Range", "Start must be before end.");
      return false;
    }
    return true;
  };

  const handleCreate = () => {
    if (validateDateRange()) {
      Alert.alert("Success", "Promotion created!");
    }
  };

  return (
    <SafeAreaView
      style={styles.main}>
      <ThemedView
        style={styles.realContainer}>
        <ThemedView
          style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.headerImage}
            onPress={() => router.navigate("/catalog")}
          >
            <Ionicons name="arrow-back" size={30} color="black"
            />
          </TouchableOpacity>
          <ThemedView
            style={styles.headerText}>
            <ThemedText
              style={styles.welcomeText}>
              Create Promotion
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView
          style={styles.mainContainer}>
          <TouchableOpacity
            style={styles.uploadBox}
            onPress={handleImageUpload}>
            <View
              style={styles.uploadPlaceholder}>
              <Ionicons name="cloud-upload-outline" size={40} color="#a1a09c"
              />
              <Text
                style={styles.uploadText}>
                Tap to upload promotion image
              </Text>
            </View>
          </TouchableOpacity>
          <View
            style={styles.inputRow}>
            <Ionicons name="pricetag-outline" size={20} color="gray" style={styles.inputIcon}
            />
            <TextInput
              placeholder="Promotion Title"
              placeholderTextColor="gray"
              style={styles.inputField}
            />
          </View>
          <View
            style={styles.inputRow}>
            <Ionicons name="pricetags-outline" size={20} color="gray" style={styles.inputIcon}
            />
            <TextInput
              placeholder="Percent Discount"
              placeholderTextColor="gray"
              keyboardType="numeric"
              style={styles.inputField}
            />
          </View>
          <TouchableOpacity
            style={styles.inputRow}
            onPress={() => openDateTimePicker("start")}
          >
            <Ionicons name="calendar-outline" size={20} color="gray" style={styles.inputIcon} />
            <Text
              style={styles.inputTextStyle}>
              {startDateTime
                ? format(startDateTime)
                : "Start Date & Time"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.inputRow}
            onPress={() => openDateTimePicker("end")}
          >
            <Ionicons name="calendar-outline" size={20} color="gray" style={styles.inputIcon} />
            <Text
              style={styles.inputTextStyle}>
              {endDateTime
                ? format(endDateTime)
                : "End Date & Time"}
            </Text>
          </TouchableOpacity>
          <View
            style={[styles.inputRow,
            { height: 100, alignItems: "flex-start" }]}>
            <Ionicons name="document-text-outline" size={20} color="gray" style={[styles.inputIcon]}
            />
            <TextInput
              placeholder="Promotion Description"
              placeholderTextColor="gray"
              multiline
              style={[styles.inputField, { height: "100%", textAlignVertical: "top" }]}
            />
          </View>
          <DateTimePickerModal
            isVisible={isPickerVisible}
            mode="datetime"
            date={pickerTempValue}
            onConfirm={handleDateTimeConfirm}
            onCancel={() => setPickerVisible(false)}
            is24Hour={true}
            minimumDate={new Date()}
            display={"default"}
          />
          <View
            style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => router.navigate("/catalog")}
            >
              <ThemedText
                style={styles.cancelButtonText}>
                Cancel
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleCreate}
            >
              <ThemedText
                style={styles.createButtonText}>
                Create
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1
  },
  realContainer: {
    flex: 1,
    paddingTop: 40
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  headerImage: {
    width: 71,
    height: 71,
    marginRight: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 71,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    paddingTop: 5,
  },
  mainContainer: {
    flex: 1,
    padding: 30,
    paddingTop: 20,
  },
  circularInput: {
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  inputText: {
    fontSize: 18,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  cancelButton: {
    backgroundColor: "#F2F2F2",
    borderWidth: 2,
    borderColor: "#D8D8D8"
  },
  createButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: "#808080",
    fontSize: 18,
    fontWeight: "bold",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#a1a09c",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 50,
    marginVertical: 8,
  },
  inputIcon: {
    marginRight: 10,
  },
  inputTextStyle: {
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
  inputField: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#E95F23",
  },
  uploadBox: {
    height: 180,
    borderWidth: 2,
    borderColor: "#a1a09c",
    borderStyle: "dashed",
    borderRadius: 12,
    marginVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fefefe",
  },
  uploadPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  uploadText: {
    marginTop: 10,
    fontSize: 14,
    color: "#a1a09c",
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});
