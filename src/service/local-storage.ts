export const LocalStorageHelper = {
  playerId: (): string => {
    const id = window.localStorage.getItem('playerId')
    if (id) {
      return id
    } else {
      window.localStorage.setItem('playerId', crypto.randomUUID())
      return LocalStorageHelper.playerId()
    }
  }
}