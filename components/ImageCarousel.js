import { useEffect, useRef, useState } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");

export const ImageCarousel = ({ images }) => {
  // Clone first and last images for smooth infinite looping
  const extendedImages = [images[images.length - 1], ...images, images[0]];

  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(1); // start from 1 (first actual image)

  // Auto-scroll every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      scrollToNext();
    }, 2000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  // Scroll to next image
  const scrollToNext = () => {
    let nextIndex = currentIndex + 1;
    scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
    setCurrentIndex(nextIndex);
  };

  // Handle scroll event (manual or automatic)
  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentIndex(index);
  };

  // Handle scroll end to loop seamlessly
  const handleScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);

    if (index === extendedImages.length - 1) {
      // Jump instantly to the first real image (index 1)
      scrollRef.current?.scrollTo({ x: width, animated: false });
      setCurrentIndex(1);
    } else if (index === 0) {
      // Jump instantly to the last real image (index = images.length)
      scrollRef.current?.scrollTo({
        x: width * images.length,
        animated: false,
      });
      setCurrentIndex(images.length);
    }
  };

  // Initial scroll to first real image
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ x: width, animated: false });
    }, 100);
  }, []);

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
      >
        {extendedImages.map((image, index) => (
          <Image
            key={index}
            source={{ uri: `data:image/jpeg;base64,${image}` }}
            style={styles.image}
          />
        ))}
      </ScrollView>

      {/* Dots indicator */}
      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              // currentIndex-1 because we start from 1 (extended array)
              {backgroundColor:  currentIndex-1 === index ? "#000" : "#fff"},
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: width,
    height: 300,
    resizeMode: "cover",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    // backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
//   activeDot: {
//     backgroundColor: "#0c6977",
//   },
});





// import { useEffect, useRef, useState } from "react";
// import {
//     Dimensions,
//     Image,
//     ScrollView,
//     StyleSheet,
//     View,
// } from "react-native";

// const { width } = Dimensions.get("window");

// export const ImageCarousel = ({ images }) => {
//   const scrollRef = useRef(null);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Auto scroll every 3 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const nextIndex = (currentIndex + 1) % images.length;
//       scrollRef.current?.scrollTo({
//         x: nextIndex * width,
//         animated: true,
//       });
//       setCurrentIndex(nextIndex);
//     }, 2000);

//     return () => clearInterval(interval);
//   }, [currentIndex]);

//   // Handle manual scroll
//   const handleScroll = (event) => {
//     const offsetX = event.nativeEvent.contentOffset.x;
//     const newIndex = Math.round(offsetX / width);
//     setCurrentIndex(newIndex);
//   };

//   return (
//     <View>
//       <ScrollView
//         ref={scrollRef}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         onScroll={handleScroll}
//         scrollEventThrottle={16}
//       >
//         {images.map((image, index) => (
//           <Image
//             key={index}
//             source={{ uri: `data:image/jpeg;base64,${image}` }}
//             style={styles.image}
//           />
//         ))}
//       </ScrollView>

//       {/* Dots indicator */}
//       <View style={styles.dotsContainer}>
//         {images.map((_, index) => (
//           <View
//             key={index}
//             style={[
//               styles.dot,
//               {backgroundColor:  currentIndex === index ? "#000" : "#fff"},
//             ]}
//           />
//         ))}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   image: {
//     width: width,
//     height: 300,
//     resizeMode: "stretch",
//   },
//   dotsContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: 8,
//   },
//   dot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     // backgroundColor: "#fff",
//     marginHorizontal: 4,
//   },
// //   activeDot: {
// //     backgroundColor: "#000",
// //   },
// });
