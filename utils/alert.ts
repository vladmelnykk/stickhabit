import { Alert } from 'react-native'

export function confirm(
  title: string,
  message: string,
  confirmText: string,
  cancelText: string,
  onConfirm: () => Promise<void>
) {
  Alert.alert(title, message, [
    {
      text: cancelText,
      style: 'cancel'
    },
    {
      text: confirmText,
      onPress: onConfirm
    }
  ])
}
