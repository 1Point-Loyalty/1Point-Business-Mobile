import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  useColorScheme,
  ScrollView,
} from "react-native";
import PagerThemedView from "react-native-pager-view";
import { useNavigation } from 'expo-router';
import { useTheme } from "@/constants/ThemeCheck";
import { TabView, SceneMap } from 'react-native-tab-view';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
import { router } from "expo-router";
import auth from '@react-native-firebase/auth';

export default function HomeScreen() {
  const navigation = useNavigation();
  const theme = useTheme();

  const [transactions, setTransactions] = useState([]);
  const [pointsIssued, setPointsIssued] = useState(0);
  const [pointsRedeemed, setPointsRedeemed] = useState(0);
  const [averageRevenue, setAverageRevenue] = useState(0);
  const [netInput, setNetInput] = useState(0);
  const [netCustomers, setNetCustomers] = useState(0);
  const [index, setIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState('Today');
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [merchantName, setMerchantName] = useState<string | null>(null);
  const [routes] = useState([
    { key: 'firstTab', title: 'Today' },
    { key: 'secondTab', title: 'Yesterday' },
    { key: 'thirdTab', title: 'Monthly' },
    { key: 'fourthTab', title: 'Yearly' },
  ]);

  const fetchMerchantId = async () => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        console.error("User not authenticated");
        return;
      }
      const userId = currentUser.uid;
      const token = await currentUser.getIdToken();
      const apiUrl = `https://admin.1-point.ca/api/getUser/${userId}`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error: ${response.status} - ${errorText}`);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const userData = await response.json();
      setTimeout(() => {
        if (Array.isArray(userData) && userData.length > 0 && userData[0].merchantID) {
          setMerchantId(userData[0].merchantID);
        } else {
          console.warn("No merchantID found.");
        }
      },);
    } catch (error) {
      console.error("Error fetching merchantId:", error);
    }
  };

  const fetchTransactions = async (merchantId: string | null) => {
    try {
      const user = auth().currentUser;
      const token = await user?.getIdToken();
      const apiURL = `https://admin.1-point.ca/api/getMerchantTransactions/${merchantId}`;
      const response = await fetch(apiURL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      setTransactions(data);

      if (data.length > 0 && data[0].merchant_name) {
        setMerchantName(data[0].merchant_name);
      }

      filterTransactionsByDate(data, selectedTab);

    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchMerchantId();
  }, []);

  useEffect(() => {
    if (merchantId) {
      fetchTransactions(merchantId);
    }
  }, [merchantId]);

  interface Transaction {
    type: string;
    id: string;
    userID: string;
    merchantID: string;
    subtotal: number;
    pointsEquivalent: number;
    createdAt: string;
    updatedAt: string;
  };

  const filterTransactionsByDate = (transactions: Transaction[], filter: string) => {
    const today = new Date();
    let filteredTransactions: Transaction[] = [];
    let dataLabels: string[] = [];
    let issuedData: number[] = [];
    let redeemedData: number[] = [];

    if (filter === "Today") {
      filteredTransactions = transactions.filter((txn: Transaction) =>
        new Date(txn.createdAt).toDateString() === today.toDateString()
      );
    } else if (filter === "Yesterday") {
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      filteredTransactions = transactions.filter((txn: Transaction) =>
        new Date(txn.createdAt).toDateString() === yesterday.toDateString()
      );
    } else if (filter === "Monthly") {
      filteredTransactions = transactions.filter((txn: Transaction) =>
        new Date(txn.createdAt).getMonth() === today.getMonth() &&
        new Date(txn.createdAt).getFullYear() === today.getFullYear()
      );
    } else if (filter === "Yearly") {
      filteredTransactions = transactions.filter((txn: Transaction) =>
        new Date(txn.createdAt).getFullYear() === today.getFullYear()
      );
    }

    let issued = 0;
    let redeemed = 0;
    let totalRevenue = 0;
    let uniqueCustomers = new Set<string>();

    const groupTransactions: { [key: string]: { issued: number; redeemed: number } } = {}

    filteredTransactions.forEach((txn: Transaction) => {
      const txnDate = new Date(txn.createdAt).toLocaleDateString();
      if (!groupTransactions[txnDate]) {
        groupTransactions[txnDate] = { issued: 0, redeemed: 0 };
      }
      if (txn.type === "transaction") {
        issued += txn.pointsEquivalent;
        groupTransactions[txnDate].issued += txn.pointsEquivalent;
      } else if (txn.type === "redemption") {
        redeemed += txn.pointsEquivalent;
        groupTransactions[txnDate].redeemed += txn.pointsEquivalent;
      }
      totalRevenue += txn.subtotal;
      uniqueCustomers.add(txn.userID);
    });

    dataLabels = Object.keys(groupTransactions);
    issuedData = dataLabels.map(date => groupTransactions[date].issued);
    redeemedData = dataLabels.map(date => Math.abs(groupTransactions[date].redeemed || 0));

    if (issuedData.length === 0) issuedData = [0];
    if (redeemedData.length === 0) redeemedData = [0];

    setPointsIssued(issued);
    setPointsRedeemed(redeemed);
    setNetInput((issued + redeemed) * 0.01)
    setAverageRevenue(totalRevenue / (uniqueCustomers.size || 1));
    setNetCustomers(uniqueCustomers.size);

    setChartData({
      labels: dataLabels.length > 0 ? dataLabels : ["No Data"],
      datasets: [
        { data: issuedData.every(num => isFinite(num)) ? issuedData : [0] },
        { data: redeemedData.every(num => isFinite(num)) ? redeemedData : [0] },
      ],
    });
  };

  useEffect(() => {
    filterTransactionsByDate(transactions, selectedTab);
  }, [selectedTab, transactions]);

  interface PointsInfo {
    title: string;
    points: string;
    percentage: string;
    increase: boolean;
  }

  const PointsDisplayCard: React.FC<PointsInfo> = ({ title, points, percentage, increase }) => {
    return (
      <View style={styles.pointsCard}>
        <Image
          source={increase ? require('@/assets/images/up-arrow.png') : require('@/assets/images/down-arrow.png')}
          style={styles.arrowImage} />
        <View style={styles.pointsPercentageContainer}>
          <View style={[styles.pointsPercentageBubble, { backgroundColor: increase ? '#4CAF50' : '#D32F2F' }]}>
            <Text style={[styles.pointsPercentageText, { color: increase ? '#E8F5E9' : '#FFCDD2' }]}>{percentage}</Text>
          </View>
        </View>
        <View style={styles.pointsContent}>
          <Text style={styles.points}>{points}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
    );
  };

  interface ChartData {
    labels: string[];
    datasets: Array<{
      data: number[];
    }>;
  }

  interface ChartProps {
    data: ChartData;
  }

  const CustomLineChart = ({ data }: ChartProps) => {
    const screenWidth = Dimensions.get('window').width;
    const chartConfig = {
      backgroundColor: '#ffffff',
      backgroundGradientFrom: '#ffffff',
      backgroundGradientTo: '#ffffff',
      decimalPlaces: 2,
      color: (opacity = 1) => `rgba(233, 95, 35, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(128, 128, 128, ${opacity})`,
      style: {
        borderRadius: 16,
      },
      propsForDots: {
        r: "6",
        strokeWidth: "1",
        stroke: '#ffffff',
      }
    };

    if (!data.labels || data.labels.length === 0) {
      return <Text style={{ textAlign: 'center', padding: 10 }}>No Data Available</Text>;
    }

    return (
      <View style={styles.chartContainer}>
        <LineChart
          data={data}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{ borderRadius: chartConfig.style.borderRadius }}
        />
      </View>
    );
  };

  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [
      { data: [] },
      { data: [] }
    ],
  });

  const viewReportButton = () => {
    return (
      <TouchableOpacity
        style={styles.reportButton}
        onPress={() => router.navigate('/(auth)/(tabs)/profile')}>
        <Text style={styles.reportButtonText}>View Reports</Text>
        <View style={styles.arrowIcon}>
          <Icon name="chevron-right" size={32} color="#ffffff" />
        </View>
      </TouchableOpacity>
    );
  };

  interface metricCardProps {
    title: string;
    value: string;
    percentage: string;
    increase: boolean;
    imageSource: any;
  }

  const MetricCard: React.FC<metricCardProps> = ({ title, value, percentage, increase, imageSource }) => {
    return (
      <View style={styles.metricCard}>
        <Image
          source={imageSource}
          style={styles.metricCardIcon} />
        <View style={styles.pointsPercentageContainer}>
          <View style={[styles.pointsPercentageBubble, { backgroundColor: increase ? '#4CAF50' : '#D32F2F' }]}>
            <Text style={[styles.pointsPercentageText, { color: increase ? '#E8F5E9' : '#FFCDD2' }]}>{percentage}</Text>
          </View>
        </View>
        <View style={styles.pointsContent}>
          <Text style={styles.points}>{value}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
    );
  };

  const renderTabBar = (props: { navigationState: { routes: { key: string, title: string }[] } }) => (
    <View style={styles.tabBar}>
      {props.navigationState.routes.map((route, i) => {
        const isFocused = index === i;
        const textColor = isFocused ? '#FFFFFF' : '#808080';
        return (
          <TouchableOpacity
            key={i}
            style={[styles.tabItem, isFocused ? styles.tabItemFocused : null]}
            onPress={() => {
              setIndex(i);
              setSelectedTab(route.title)
            }}>
            <Text style={[styles.tabText, { color: textColor }]}>
              {route.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const Today = () => (
    <ScrollView
      style={[styles.tabDisplay, { backgroundColor: 'F2F2F2' }]}>
      <ThemedText
        style={[styles.displayText, { backgroundColor: theme.colors.background }]}>
        SUMMARY AND INSIGHTS
      </ThemedText>
      <View
        style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
        <PointsDisplayCard
          title="POINTS ISSUED"
          points={pointsIssued.toLocaleString()}
          percentage="+24%"
          increase={true}
        />
        <PointsDisplayCard
          title="POINTS REDEEMED"
          points={pointsRedeemed.toLocaleString()}
          percentage="-16%"
          increase={false}
        />
      </View>
      <View
        style={styles.displayChartContainer}>
        <CustomLineChart data={chartData} />
        {viewReportButton()}
      </View>
      <ThemedText
        style={[styles.displayText, { backgroundColor: theme.colors.background }]}>
        KEY METRICS
      </ThemedText>
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={styles.displayMetricContainer}>
        <MetricCard
          title="AVERAGE REVENUE"
          value={`$${averageRevenue.toFixed(2)}`}
          percentage="+24%"
          increase={true}
          imageSource={require('@/assets/images/growthIcon.png')}
        />
        <MetricCard
          title="NET INPUT"
          value={`$${netInput.toFixed(2)}`}
          percentage="-16%"
          increase={false}
          imageSource={require('@/assets/images/inputIcon.png')}
        />
        <MetricCard
          title="NET# CUSTOMER"
          value={netCustomers.toLocaleString()}
          percentage="-16%"
          increase={false}
          imageSource={require('@/assets/images/customerIcon.png')}
        />
      </ScrollView>
    </ScrollView>
  );

  const Yesterday = () => (
    <ScrollView
      style={[styles.tabDisplay, { backgroundColor: 'F2F2F2' }]}>
      <ThemedText
        style={[styles.displayText, { backgroundColor: theme.colors.background }]}>
        SUMMARY AND INSIGHTS
      </ThemedText>
      <View
        style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
        <PointsDisplayCard
          title="POINTS ISSUED"
          points={pointsIssued.toLocaleString()}
          percentage="+4%"
          increase={true}
        />
        <PointsDisplayCard
          title="POINTS REDEEMED"
          points={pointsRedeemed.toLocaleString()}
          percentage="+88%"
          increase={true}
        />
      </View>
      <View
        style={styles.displayChartContainer}>
        <CustomLineChart data={chartData} />
        {viewReportButton()}
      </View>
      <ThemedText
        style={[styles.displayText, { backgroundColor: theme.colors.background }]}>
        KEY METRICS
      </ThemedText>
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={styles.displayMetricContainer}>
        <MetricCard
          title="AVERAGE REVENUE"
          value={`$${averageRevenue.toFixed(2)}`}
          percentage="-25%"
          increase={false}
          imageSource={require('@/assets/images/growthIcon.png')}
        />
        <MetricCard
          title="NET INPUT"
          value={`$${netInput.toFixed(2)}`}
          percentage="-16%"
          increase={false}
          imageSource={require('@/assets/images/inputIcon.png')}
        />
        <MetricCard
          title="NET# CUSTOMER"
          value={netCustomers.toLocaleString()}
          percentage="-98%"
          increase={false}
          imageSource={require('@/assets/images/customerIcon.png')}
        />
      </ScrollView>
    </ScrollView>
  );

  const Monthly = () => (
    <ScrollView
      style={[styles.tabDisplay, { backgroundColor: 'F2F2F2' }]}>
      <ThemedText
        style={[styles.displayText, { backgroundColor: theme.colors.background }]}>
        SUMMARY AND INSIGHTS
      </ThemedText>
      <View
        style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
        <PointsDisplayCard
          title="POINTS ISSUED"
          points={pointsIssued.toLocaleString()}
          percentage="+105%"
          increase={true}
        />
        <PointsDisplayCard
          title="POINTS REDEEMED"
          points={pointsRedeemed.toLocaleString()}
          percentage="+167%"
          increase={true}
        />
      </View>
      <View
        style={styles.displayChartContainer}>
        <CustomLineChart data={chartData} />
        {viewReportButton()}
      </View>
      <ThemedText
        style={[styles.displayText, { backgroundColor: theme.colors.background }]}>
        KEY METRICS
      </ThemedText>
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={styles.displayMetricContainer}>
        <MetricCard
          title="AVERAGE REVENUE"
          value={`$${averageRevenue.toFixed(2)}`}
          percentage="+210%"
          increase={true}
          imageSource={require('@/assets/images/growthIcon.png')}
        />
        <MetricCard
          title="NET INPUT"
          value={`$${netInput.toFixed(2)}`}
          percentage="+198%"
          increase={true}
          imageSource={require('@/assets/images/inputIcon.png')}
        />
        <MetricCard
          title="NET# CUSTOMER"
          value={netCustomers.toLocaleString()}
          percentage="-16%"
          increase={false}
          imageSource={require('@/assets/images/customerIcon.png')}
        />
      </ScrollView>
    </ScrollView>
  );

  const Yearly = () => (
    <ScrollView
      style={[styles.tabDisplay, { backgroundColor: 'F2F2F2' }]}>
      <ThemedText
        style={[styles.displayText, { backgroundColor: theme.colors.background }]}>
        SUMMARY AND INSIGHTS
      </ThemedText>
      <View
        style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
        <PointsDisplayCard
          title="POINTS ISSUED"
          points={pointsIssued.toLocaleString()}
          percentage="-4%"
          increase={false}
        />
        <PointsDisplayCard
          title="POINTS REDEEMED"
          points={pointsRedeemed.toLocaleString()}
          percentage="-167%"
          increase={false}
        />
      </View>
      <View
        style={styles.displayChartContainer}>
        <CustomLineChart data={chartData} />
        {viewReportButton()}
      </View>
      <ThemedText
        style={[styles.displayText, { backgroundColor: theme.colors.background }]}>
        KEY METRICS
      </ThemedText>
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={styles.displayMetricContainer}>
        <MetricCard
          title="AVERAGE REVENUE"
          value={`$${averageRevenue.toFixed(2)}`}
          percentage="-67%"
          increase={false}
          imageSource={require('@/assets/images/growthIcon.png')}
        />
        <MetricCard
          title="NET INPUT"
          value={`$${netInput.toFixed(2)}`}
          percentage="-46%"
          increase={false}
          imageSource={require('@/assets/images/inputIcon.png')}
        />
        <MetricCard
          title="NET# CUSTOMER"
          value={netCustomers.toLocaleString()}
          percentage="+68%"
          increase={true}
          imageSource={require('@/assets/images/customerIcon.png')}
        />
      </ScrollView>
    </ScrollView>
  );

  const renderScene = SceneMap({
    firstTab: Today,
    secondTab: Yesterday,
    thirdTab: Monthly,
    fourthTab: Yearly,
  });

  return (
    <SafeAreaView style={[styles.main, { backgroundColor: theme.colors.card }]}>
      <ThemedView
        style={[styles.realContainer, { backgroundColor: theme.colors.card }]}
      >
        <ThemedView
          style={[
            styles.headerContainer,
            { backgroundColor: theme.colors.card },
          ]}
        >
          <Image
            source={require("@/assets/images/1Point_Logo.png")}
            style={styles.headerImage}
          />
          <ThemedView
            style={[styles.headerText, { backgroundColor: theme.colors.card }]}
          >
            <ThemedText style={[styles.welcomeText]}>{`WELCOME ${merchantName?.toUpperCase()}`}</ThemedText>
          </ThemedView>
        </ThemedView>
        <View
          style={[
            styles.mainContainer,
            { backgroundColor: theme.colors.background, flex: 1, },
          ]}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1, }}>
            <TabView
              navigationState={{ index, routes }}
              renderScene={renderScene}
              onIndexChange={setIndex}
              renderTabBar={renderTabBar}
            />
          </ScrollView>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  //-------------- Main App styling -----------------

  main: {
    flex: 1,
    paddingTop: 15,
    //paddingBottom: 50
  },
  mainContainer: {
    flex: 1,
    //paddingBottom: 100,
    //paddingTop: 20,
    borderTopLeftRadius: 46,
    borderTopRightRadius: 46,
  },
  realContainer: {
    flex: 1,
    paddingTop: 40,
    //paddingBottom: 50
  },

  //-------------- Header styling -----------------

  headerText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 71,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerImage: {
    width: 71,
    height: 71,
    marginRight: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    paddingTop: 10,
    letterSpacing: 1,
    textAlign: "center",
  },
  subHeadingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "gray",
    fontVariant: ["small-caps"],
    padding: 10,
  },
  subHeading2Text: {
    fontSize: 16,
    fontWeight: "600",
    color: "gray",
    fontVariant: ["small-caps"],
  },

  //-------------- Points Card Styling -----------------

  pointsCard: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    height: 140,
    justifyContent: 'center',
  },
  arrowImage: {
    position: 'absolute',
    top: 5,
    left: 10,
    width: 70,
    height: 70,
  },
  pointsPercentageContainer: {
    position: 'absolute',
    top: 12,
    right: 18,
    zIndex: 1
  },
  pointsPercentageBubble: {
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 6
  },
  pointsPercentageText: {
    fontSize: 16,
    fontWeight: 'bold',
    zIndex: 1
  },
  pointsContent: {
    marginTop: 45,
    alignItems: 'center',
  },
  points: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  title: {
    paddingTop: 5,
    fontSize: 18,
    color: '#757575',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  //-------------- Chart Styling -----------------

  chartContainer: {
    padding: 10,
    margin: 15,
    marginTop: -1,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    backgroundColor: '#ffffff',
  },

  //-------------- Report Button Styling -----------------

  reportButton: {
    marginHorizontal: 15,
    backgroundColor: '#FF6D00',
    padding: 10,
    paddingLeft: 25,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginTop: -2,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  reportButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  arrowIcon: {
    height: 30,
    width: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  //-------------- Metric Card Styling -----------------

  metricCard: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    width: 160
  },
  metricCardIcon: {
    width: 60,
    height: 60,
    marginBottom: -25,
  },

  //-------------- Tab Bar Styling -----------------

  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  tabItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#F2F2F2',
    borderColor: '#D8D8D8',
    borderWidth: 2
  },
  tabItemFocused: {
    backgroundColor: '#E95F23',
    borderColor: '#E95F23'
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  //-------------- Tab Display Styling -----------------

  tabDisplay: {
    flex: 1,
  },
  displayText: {
    fontSize: 21,
    fontWeight: "700",
    fontVariant: ["small-caps"],
    paddingHorizontal: 10,
    marginLeft: 8,
    marginTop: 15,
    marginBottom: 0
  },
  displayChartContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  displayMetricContainer: {
    flexDirection: 'row',
    padding: 10,
  },
});



/* // Array of elements to display
const sliderElements = [
  {
    key: "1",
    imageUri:
      "https://pbs.twimg.com/profile_images/1715769848838381568/5ZjyeyH-_400x400.jpg",
    ThemedText: "Welcome to 1Point, Shawerma Plus!",
  },
  {
    key: "2",
    imageUri:
      "https://pbs.twimg.com/profile_images/1008734359816269829/FiJnG7zn_400x400.jpg",
    ThemedText: "Your last payment of $12.50 was received!",
  },
];

const [currentPage, setCurrentPage] = useState(0); // Track the current page
const pagerRef = useRef<PagerThemedView>(null); // Reference to the pager ThemedView
const totalElements = sliderElements.length; // Total number of elements

// Auto-scroll every 4 seconds to the next page in the list of elemtents
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentPage((prevElement) => {
      // Calculate the next page to display
      const nextElement = (prevElement + 1) % totalElements;
      // If the pagerRef is available, set the page to the next page
      if (pagerRef.current) {
        pagerRef.current.setPage(nextElement);
      }
      // Return the next page
      return nextElement;
    });
  }, 4000);

  return () => clearInterval(interval);
}, []);

// Render the NEW section elements
const renderSlider = () => {
  return (
    // Use the PagerThemedView component to display the elements
    <PagerThemedView
      style={[
        styles.sliderContainer,
        { backgroundColor: theme.colors.background },
      ]}
      initialPage={0}
      ref={pagerRef}
      onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
    >
      {sliderElements.map((element) => (
        <ThemedView
          style={[
            styles.sliderSection,
            styles.shadowProp,
            { backgroundColor: theme.colors.card },
          ]}
          key={element.key}
        >
          {element.imageUri ? (
            <Image
              source={{ uri: element.imageUri }}
              style={styles.sliderLogoContainer}
            />
          ) : null}
          {element.imageUri ? (
            <ThemedView style={styles.newLabelContainer}>
              <ThemedText style={styles.newLabel}>NEW</ThemedText>
            </ThemedView>
          ) : null}
          <ThemedText style={[styles.newText, { color: theme.colors.text }]}>
            {element.ThemedText}
          </ThemedText>
        </ThemedView>
      ))}
    </PagerThemedView>
  );
};

// Render the dots to indicate the current page
const renderPageDots = () => {
  return (
    <ThemedView style={styles.dotsContainer}>
      {sliderElements.map((_, index) => (
        <ThemedView
          key={index}
          style={[
            styles.dot,
            currentPage === index ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </ThemedView>
  );
};

// Render the points section
const renderPointsSection = () => {
  return (
    <ThemedView
      style={[
        styles.pointsSection,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <ThemedView style={{ backgroundColor: theme.colors.background }}>
        <ThemedView
          style={[
            styles.row,
            styles.shadowProp,
            { backgroundColor: theme.colors.card },
          ]}
        >
          <ThemedText style={styles.subHeading2Text}>
            Points Collected
          </ThemedText>
          <ThemedView
            style={[
              styles.pointContainer,
              { backgroundColor: theme.colors.card },
            ]}
          >
            <Image
              source={require("@/assets/images/1Point_Logo.png")}
              style={styles.pointAmounts}
            />
            <ThemedText
              style={[styles.pointText, { color: theme.colors.text }]}
            >
              1978
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.backLabelContainerUp}>
            <ThemedText style={styles.backLabel}>
              +48% - Last Month
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView
          style={[
            styles.row,
            styles.shadowProp,
            { backgroundColor: theme.colors.card },
          ]}
        >
          <ThemedText style={styles.subHeading2Text}>
            Average Revenue
          </ThemedText>
          <ThemedView
            style={[
              styles.pointContainer,
              { backgroundColor: theme.colors.card },
            ]}
          >
            <ThemedText
              style={[styles.pointText, { color: theme.colors.text }]}
            >
              $48.69
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.backLabelContainerUp}>
            <ThemedText style={styles.backLabel}>
              +107% - Last Month
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <ThemedView style={{ backgroundColor: theme.colors.background }}>
        <ThemedView
          style={[
            styles.row,
            styles.shadowProp,
            { backgroundColor: theme.colors.card },
          ]}
        >
          <ThemedText style={styles.subHeading2Text}>
            Points Issued
          </ThemedText>
          <ThemedView
            style={[
              styles.pointContainer,
              { backgroundColor: theme.colors.card },
            ]}
          >
            <Image
              source={require("@/assets/images/1Point_Logo.png")}
              style={styles.pointAmounts}
            />
            <ThemedText
              style={[styles.pointText, { color: theme.colors.text }]}
            >
              2256
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.backLabelContainerUp}>
            <ThemedText style={styles.backLabel}>
              +26% - Last Month
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView
          style={[
            styles.row,
            styles.shadowProp,
            { backgroundColor: theme.colors.card },
          ]}
        >
          <ThemedText style={styles.subHeading2Text}>
            Net # Customers
          </ThemedText>
          <ThemedView
            style={[
              styles.pointContainer,
              { backgroundColor: theme.colors.card },
            ]}
          >
            <ThemedText
              style={[styles.pointText, { color: theme.colors.text }]}
            >
              340
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.backLabelContainerDown}>
            <ThemedText style={styles.backLabelWhite}>
              -12% - Last Month
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

// Render the home screen
return (
  <SafeAreaView style={[styles.main, { backgroundColor: theme.colors.card }]}>
    <ThemedView
      style={[styles.realContainer, { backgroundColor: theme.colors.card }]}
    >
      <ThemedView
        style={[
          styles.headerContainer,
          { backgroundColor: theme.colors.card },
        ]}
      >
        <Image
          source={require("@/assets/images/1Point_Logo.png")}
          style={styles.headerImage}
        />
        <ThemedView
          style={[styles.headerText, { backgroundColor: theme.colors.card }]}
        >
          <ThemedText style={[styles.welcomeText]}>WELCOME JOHN</ThemedText>
        </ThemedView>
      </ThemedView>
      <ThemedView
        style={[
          styles.mainContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ThemedText
          style={[
            styles.subHeadingText,
            { backgroundColor: theme.colors.background },
          ]}
        >
          LATEST UPDATES
        </ThemedText>

        {renderSlider()}

        <ThemedText
          style={[
            styles.subHeadingText,
            { backgroundColor: theme.colors.background },
          ]}
        >
          SUMMARY AND INSIGHTS
        </ThemedText>

        <ThemedView>{renderPointsSection()}</ThemedView>
      </ThemedView>
    </ThemedView>
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
//-------------- Main App styling -----------------
main: {
  flex: 1,
  paddingTop: 15,
},
mainContainer: {
  flex: 1,
  padding: 30,
  paddingTop: 20,
  borderTopLeftRadius: 46,
  borderTopRightRadius: 46,
},
realContainer: {
  flex: 1,
  paddingTop: 40,
},

//-------------- Header styling -----------------

headerText: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  marginRight: 71,
},

headerContainer: {
  flexDirection: "row",
  alignItems: "center",
},

headerImage: {
  width: 71,
  height: 71,
  marginRight: 20,
  justifyContent: "center",
  alignItems: "center",
},

welcomeText: {
  fontSize: 26,
  fontWeight: "bold",
  paddingTop: 5,
},

subHeadingText: {
  fontSize: 16,
  fontWeight: "600",
  color: "gray",
  fontVariant: ["small-caps"],
  padding: 10,
},

subHeading2Text: {
  fontSize: 16,
  fontWeight: "600",
  color: "gray",
  fontVariant: ["small-caps"],
},

//-------------- Slider styling -----------------

sliderSection: {
  flexDirection: "row",
  alignItems: "center",
  padding: 10,
  borderRadius: 26,
  margin: 5,
  position: "relative",
  height: 150,
},

sliderLogoContainer: {
  width: 120,
  height: 120,
  borderRadius: 10,
},

sliderContainer: {
  flex: 0.9,
  maxHeight: 200,
},

//-------------- New Icon styling -----------------

newLabelContainer: {
  position: "absolute",
  top: 10,
  right: 10,
  backgroundColor: "white",
  borderRadius: 26,
},

backLabelContainerUp: {
  backgroundColor: "#4BB543",
  borderRadius: 26,
},

backLabelContainerDown: {
  backgroundColor: "#ff4545",
  borderRadius: 26,
},

newLabel: {
  color: "black",
  paddingHorizontal: 10,
  paddingVertical: 5,
},

backLabel: {
  color: "black",
  paddingHorizontal: 10,
  paddingVertical: 5,
  fontSize: 11,
},

backLabelWhite: {
  color: "white",
  paddingHorizontal: 10,
  paddingVertical: 5,
  fontSize: 11,
},

newText: {
  fontSize: 20,
  marginLeft: 10,
  flexShrink: 1,
  color: "white",
},

//-------------- Point Section styling -----------------

pointsSection: {
  padding: "1%",
  flexDirection: "row",
  justifyContent: "space-evenly",
},

pointAmounts: {
  width: 46,
  height: 46,
},

row: {
  justifyContent: "space-evenly",
  borderRadius: 16,
  alignItems: "center",
  marginHorizontal: "5%",
  marginBottom: 10,
  marginVertical: "5%",
  minHeight: 150,
  minWidth: "30%",
},

shadowProp: {
  shadowColor: "#171717",
  shadowOffset: { width: -2, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 3,
},

pointContainer: {
  flexDirection: "row",
  alignItems: "center",
},
pointText: {
  fontSize: 30,
  paddingTop: 10,
},
label: {
  fontSize: 16,
  fontWeight: "bold",
},
transactionRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},
transactionText: {
  fontSize: 20,
  fontWeight: "bold",
},

//-------------- Dots styling -----------------

dotsContainer: {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginVertical: 10,
},
dot: {
  width: 10,
  height: 10,
  borderRadius: 5,
  marginHorizontal: 5,
},
activeDot: {
  backgroundColor: "black",
},
inactiveDot: {
  backgroundColor: "gray",
},
}); */













































































