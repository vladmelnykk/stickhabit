import { drizzle } from 'drizzle-orm/expo-sqlite'
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import * as SQLite from 'expo-sqlite'

async function initDatabase() {
  const sqlite = await SQLite.openDatabaseAsync(process.env.EXPO_PUBLIC_DATABASE_NAME as string, {
    enableChangeListener: true
  })
  const db = drizzle(sqlite)
  return { sqlite, db }
}

const backupDatabase = async (db: SQLite.SQLiteDatabase, backupName: string) => {
  await db.execAsync('PRAGMA wal_checkpoint(FULL);')
  await db.execAsync('PRAGMA journal_mode=DELETE;')
  const dbPath = FileSystem.documentDirectory + `SQLite/${db.databasePath.split('/').pop()}`

  const backupPath = FileSystem.documentDirectory + 'SQLite/backup.sqlite'
  await FileSystem.copyAsync({
    from: dbPath,
    to: backupPath
  })

  await Sharing.shareAsync(backupPath, {
    mimeType: 'application/x-sqlite3'
  })

  await FileSystem.deleteAsync(backupPath, { idempotent: true })
}

const restoreDatabase = async (db: SQLite.SQLiteDatabase) => {
  const res = await DocumentPicker.getDocumentAsync({
    type: '*/*',
    copyToCacheDirectory: true,
    multiple: false
  })

  if (res.canceled) {
    return false
  }

  const backupPath = res.assets[0].uri

  const isSqlite = res.assets[0].name.endsWith('.sqlite')
  if (!isSqlite || !(await FileSystem.getInfoAsync(backupPath)).exists) {
    return false
  }

  // TODO: SDK 53 fix this issue with NullPointerException
  await db.closeAsync()
  const dbPath = FileSystem.documentDirectory + `SQLite/${db.databasePath.split('/').pop()}`

  await FileSystem.deleteAsync(dbPath + '-wal', { idempotent: true })
  await FileSystem.deleteAsync(dbPath + '-shm', { idempotent: true })
  await FileSystem.copyAsync({
    from: backupPath,
    to: dbPath
  })

  return true
}

export { backupDatabase, initDatabase, restoreDatabase }
