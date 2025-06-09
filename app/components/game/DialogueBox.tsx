interface DialogueBoxProps {
  character: string
  message: string
  onNext?: () => void
  showNext?: boolean
}

export function DialogueBox({
  character,
  message,
  onNext,
  showNext = true,
}: DialogueBoxProps) {
  return (
    <div className="dialogue-box fade-in">
      <div className="text-primary mb-2 font-bold">{character}:</div>
      <div className="typing-effect text-foreground mb-3 leading-relaxed">{message}</div>
      {showNext && (
        <div className="text-right">
          <button onClick={onNext} className="rpg-button text-secondary hover:text-secondary/80 text-xs">
            [PRESS SPACE TO CONTINUE] ▶
          </button>
        </div>
      )}
    </div>
  )
} 