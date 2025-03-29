export const LocalStorageHelper = {
  playerId: (): string => {
    // Check if code is running in a browser environment
    if (typeof window === 'undefined') {
      return ''
    }

    const id = window.localStorage.getItem('playerId')
    if (id !== null) {
      return id
    } else {
      // Generate UUID safely
      const newId = crypto.randomUUID()
      window.localStorage.setItem('playerId', newId)
      return newId
    }
  }
}
