import { useContext } from "react"
import { GameContext } from ".";

export const useGameContext = () => {
  const context = useContext(GameContext)
  if (!context) throw Error('useGameContext must be used within a GameProvider')
  return context;
}