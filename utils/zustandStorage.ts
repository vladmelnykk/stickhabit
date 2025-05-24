import { MMKV } from 'react-native-mmkv'
import { StateStorage } from 'zustand/middleware'

// Create a MMKV instance
const storage = new MMKV()

const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value)
  },
  getItem: name => {
    const value = storage.getString(name)
    return value ?? null
  },
  removeItem: name => {
    return storage.delete(name)
  }
}

export default zustandStorage
