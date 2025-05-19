import { Alert } from 'react-native'

export function confirm(
  title: string,
  message: string,
  confirmText: string,
  onConfirm: () => Promise<void>
) {
  Alert.alert(title, message, [
    {
      text: 'Cancel',
      style: 'cancel'
    },
    {
      text: confirmText,
      onPress: onConfirm
    }
  ])
}
