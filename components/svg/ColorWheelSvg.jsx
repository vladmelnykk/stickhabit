import * as React from 'react'
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
const ColorWheelSvg = props => (
  <Svg
    viewBox="0 0 280 280"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M280 140c0 77.32-62.68 140-140 140S0 217.32 0 140 62.68 0 140 0s140 62.68 140 140"
      fill="#fff"
    />
    <Path
      d="M140 0c77.319 0 139.999 62.68 139.999 140S217.319 280 140 280C62.68 280 0 217.32 0 140S62.68 0 140 0"
      fill="url(#a)"
      fillOpacity={0.5}
    />
    <Path
      d="M280 140c0 77.32-62.68 140-140 140S0 217.32 0 140 62.68 0 140 0s140 62.68 140 140"
      fill="url(#b)"
      fillOpacity={0.5}
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={0}
        y1={139.809}
        x2={279.999}
        y2={140}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="red" />
        <Stop offset={0} stopColor="#7D00FF" />
        <Stop offset={0.49} stopColor="#FEFFFE" />
        <Stop offset={1} stopColor="#7DFF00" />
      </LinearGradient>
      <LinearGradient id="b" x1={140.191} y1={0} x2={140} y2={280} gradientUnits="userSpaceOnUse">
        <Stop stopColor="red" />
        <Stop offset={0.49} stopColor="#FEFFFE" />
        <Stop offset={1} stopColor="#0FF" />
      </LinearGradient>
    </Defs>
  </Svg>
)
export default ColorWheelSvg
