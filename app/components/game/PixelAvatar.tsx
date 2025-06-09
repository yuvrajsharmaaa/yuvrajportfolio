interface PixelAvatarProps {
  mood?: "neutral" | "happy" | "thinking"
}

export function PixelAvatar({ mood = "neutral" }: PixelAvatarProps) {
  return (
    <div className="npc-avatar float-animation">
      <div className="status-bar health-bar mt-2">
        <div className="status-bar-fill" style={{ width: "75%" }}></div>
      </div>
    </div>
  )
} 