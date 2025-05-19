import { initDatabase } from '@/utils/db'
import { drizzle } from 'drizzle-orm/expo-sqlite'
import { SQLiteDatabase } from 'expo-sqlite'
import React from 'react'
interface SQLiteProviderProps {
  children: React.ReactNode
}

interface DatabaseContext {
  sqlite: SQLiteDatabase
  db: ReturnType<typeof drizzle>
  refreshDatabase: () => Promise<void>
}

const SQLiteContext = React.createContext<DatabaseContext | null>(null)

export const useDatabase = () => {
  const ctx = React.useContext(SQLiteContext)
  if (!ctx) {
    throw new Error('useDatabase must be used within a DatabaseProvider')
  }
  return ctx
}

const SQLiteProvider = ({ children }: SQLiteProviderProps) => {
  const [db, setDb] = React.useState<ReturnType<typeof drizzle> | null>(null)
  const [sqlite, setSqlite] = React.useState<SQLiteDatabase | null>(null)
  const [loading, setLoading] = React.useState(true)

  const refreshDatabase = React.useCallback(async () => {
    setLoading(true)

    const { sqlite: newSqlite, db } = await initDatabase()
    setSqlite(newSqlite)
    setDb(db)
    setLoading(false)
  }, [])

  React.useEffect(() => {
    refreshDatabase()
  }, [refreshDatabase])

  const isFullyLoaded = !loading && !!db && !!sqlite

  return (
    isFullyLoaded && (
      <SQLiteContext.Provider value={{ refreshDatabase, sqlite, db }}>
        {children}
      </SQLiteContext.Provider>
    )
  )
}

export default SQLiteProvider
