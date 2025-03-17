import { useContext } from "react"
import { GameContext } from ".";

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) throw Error('useGame must be used within a GameProvider')
  return context;
}