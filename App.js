import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import * as Location from "expo-location";

// const { height, width } = Dimensions.get("window"); // 화면 크기 얻기
// consot SCREEN_WIDTH = Dimensions.get("window").width;  // 아래와 같은 코드 ES6 문법?
const { width: SCREEN_WIDTH } = Dimensions.get("window");
console.log("SCREEN_WIDTH", SCREEN_WIDTH);

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [location, setLocation] = useState();
  const [ok, setOk] = useState(true);
  // 요청을 보냄
  const ask = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync(); // forground - 앱 사용 중에만 위치를 사용
    if (!granted) {
      setOk(false);
    }
    // prettier-ignore
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    // console.log("location", location[0].city);
  };

  useEffect(() => {
    ask();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>

      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false} // "false"로도 가능하지만 {false}로 쓰는게 더 좋음
        // indicatorStyle="white"  // 안드로이드에서는 이 pros 작동X
        contentContainerStyle={styles.weather}
      >
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>맑음</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>맑음</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>맑음</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>맑음</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "orange",
  },
  cityName: {
    fontSize: 58,
    fontWeight: "500",
  },
  weather: {
    // backgroundColor: "teal",
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    marginTop: 50,
    fontSize: 178,
    fontWeight: "600",
  },
  description: {
    marginTop: -20,
    fontSize: 60,
  },
});
