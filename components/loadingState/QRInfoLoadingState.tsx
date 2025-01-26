import ContentLoader, { Rect } from "react-content-loader/native";

import { Dimensions, StyleSheet } from "react-native";

import React from "react";

export default function QRInfoLoadingState(): JSX.Element {
  return (
    <ContentLoader
      speed={2}
      width={Dimensions.get("window").width - 40}
      height={200}
      backgroundColor="#d6d6d6"
      foregroundColor="#ecebeb"
      style={[styles.contentLoader, { alignSelf: "center" }]}
    >
      <Rect
        x={(Dimensions.get("window").width - 340) / 2}
        y="0"
        rx="4"
        ry="4"
        width="300"
        height="35"
      />
      <Rect
        x={(Dimensions.get("window").width - 290) / 2}
        y="50"
        rx="3"
        ry="3"
        width="250"
        height="25"
      />
      <Rect
        x={(Dimensions.get("window").width - 290) / 2}
        y="90"
        rx="3"
        ry="3"
        width="250"
        height="25"
      />
    </ContentLoader>
  );
}

const styles = StyleSheet.create({
  contentLoader: {
    marginVertical: 20,
  },
});
