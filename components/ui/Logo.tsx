import React from 'react'
import { Image, StyleSheet } from 'react-native'

const Logo = () => {
  return <Image style={styles.logo} source={require('../../assets/images/favicon.png')} />
}

export default Logo

const styles = StyleSheet.create({ logo: { width: 38, height: 38 } })
