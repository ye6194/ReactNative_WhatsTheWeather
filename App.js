import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";

// const { height, width } = Dimensions.get("window"); // 화면 크기 얻기
// consot SCREEN_WIDTH = Dimensions.get("window").width;  // 아래와 같은 코드 ES6 문법?
const { width: SCREEN_WIDTH } = Dimensions.get("window");
console.log("SCREEN_WIDTH", SCREEN_WIDTH);

const API_KEY = "d8fb21d6e7f63a694610873f153d9aff"; // 원래는 api 키를 앱에 두면 안됨

export default function App() {
  const [city, setCity] = useState("Loading...");
  // const [location, setLocation] = useState();
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  // 요청을 보냄
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync(); // forground - 앱 사용 중에만 위치를 사용
    if (!granted) {
      setOk(false);
      // 요청을 보냈는데 유저가 허락하지 않았을 때 로직 짜보기
    }

    // prettier-ignore
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&cnt=7&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDays(json.list);
    // console.log("json.daily", json.list);
  };

  useEffect(() => {
    getWeather();
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
        // indicatorStyle="white"  // 안드로이드에서는 이 props 작동X
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="white" size="large" style={{ marginTop: 10 }} />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <Text style={styles.temp}>{parseFloat(day.main.temp).toFixed(1)}</Text>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
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
  },
  cityName: {
    fontSize: 58,
    fontWeight: "500",
    color: "white",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20,
    // backgroundColor: "orange",
  },
  temp: {
    marginTop: 50,
    fontSize: 100,
    fontWeight: "600",
    color: "white",
  },
  description: {
    marginTop: -10,
    fontSize: 30,
    fontWeight: 500,
    color: "white",
  },
  tinyText: {
    marginTop: -5,
    fontSize: 25,
    fontWeight: 500,
    color: "white",
  },
});
