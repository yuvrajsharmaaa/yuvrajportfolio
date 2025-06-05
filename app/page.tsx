"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Mail, Github, Linkedin, Building, Code, Gamepad2, Terminal, Zap, Brain, Cpu, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Game state management
type GameState = "start" | "home" | "about" | "projects" | "blogs" | "contact"
type ProjectCategory = "architecture" | "software" | "games" | "more"
type MoreProjectCategory = "c" | "cpp" | "python" | "fullstack"

// Sound effects
const playSound = (type: "click" | "hover" | "success") => {
  if (typeof window === 'undefined') return;
  const audio = new window.Audio();
  switch (type) {
    case "click":
      audio.src = "/assets/sfx/click.mp3";
      break;
    case "hover":
      audio.src = "/assets/sfx/hover.mp3";
      break;
    case "success":
      audio.src = "/assets/sfx/success.mp3";
      break;
  }
  audio.volume = 0.2;
  audio.play().catch(() => {}); // Ignore autoplay restrictions
}

// Pixel art avatar component
function PixelAvatar({ mood = "neutral" }: { mood?: "neutral" | "happy" | "thinking" }) {
  return (
    <div className="npc-avatar float-animation">
      <div className="status-bar health-bar mt-2">
        <div className="status-bar-fill" style={{ width: "75%" }}></div>
      </div>
    </div>
  )
}

// Dialogue box component
function DialogueBox({
  character,
  message,
  onNext,
  showNext = true,
}: {
  character: string
  message: string
  onNext?: () => void
  showNext?: boolean
}) {
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

// Game UI Button
function GameButton({
  children,
  onClick,
  variant = "primary",
  keyHint,
  className = "",
}: {
  children: React.ReactNode
  onClick: () => void
  variant?: "primary" | "secondary" | "danger"
  keyHint?: string
  className?: string
}) {
  return (
    <button
      onClick={() => {
        playSound("click")
        onClick()
      }}
      onMouseEnter={() => playSound("hover")}
      className={`rpg-button ${className}`}
    >
      <div className="flex items-center justify-center gap-2">
        {keyHint && <span className="key-nav"><kbd>{keyHint}</kbd></span>}
        {children}
      </div>
    </button>
  )
}

// Stats display component
function StatsDisplay() {
  return (
    <div className="card-game p-4 float-animation">
      <div className="text-primary font-bold mb-3 text-center">PLAYER STATS</div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">LEVEL:</span>
          <span className="text-primary">JUNIOR+</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">EXP:</span>
          <span className="text-secondary">1+ YEARS</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">CLASS:</span>
          <span className="text-accent">HYBRID</span>
        </div>
        <div className="mt-3">
          <div className="text-muted-foreground text-xs mb-1">SKILLS:</div>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div className="text-primary">AR/VR ████████░░</div>
            <div className="text-secondary">GAME DEV ██████░░░░</div>
            <div className="text-accent">WEB3 ██████░░░░</div>
            <div className="text-primary">PROGRAMMING ████████░░</div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="text-xs text-muted-foreground">HEALTH</div>
          <div className="status-bar health-bar">
            <div className="status-bar-fill" style={{ width: "85%" }}></div>
          </div>
          <div className="text-xs text-muted-foreground">MANA</div>
          <div className="status-bar mana-bar">
            <div className="status-bar-fill" style={{ width: "65%" }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Game Progress Bar
function GameProgressBar({ progress, label }: { progress: number; label: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-primary">{progress}%</span>
      </div>
      <div className="skill-bar">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

// Game Achievement Badge
function GameAchievement({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="card-game p-3 hover:scale-105 transition-transform">
      <div className="flex items-center gap-3">
        <div className="text-2xl">{icon}</div>
        <div>
          <div className="text-primary font-bold text-sm">{title}</div>
          <div className="text-xs text-muted-foreground">{description}</div>
        </div>
      </div>
    </div>
  )
}

// Game Inventory Item
function GameInventoryItem({ name, type, rarity }: { name: string; type: string; rarity: "common" | "rare" | "epic" | "legendary" }) {
  const rarityColors = {
    common: "text-muted-foreground",
    rare: "text-blue-400",
    epic: "text-purple-400",
    legendary: "text-yellow-400",
  }

  return (
    <div className={`card-game p-2 ${rarityColors[rarity]}`}>
      <div className="text-xs font-bold">{name}</div>
      <div className="text-[10px] opacity-75">{type}</div>
    </div>
  )
}

type Project = {
  title: string;
  description: string;
  tech: string[];
  status: string;
  image: string;
  demoUrl?: string;
}

type MoreProject = {
  title: string;
  description: string;
  tech: string[];
  status: string;
  image?: string;
}

export default function GamePortfolio() {
  const [gameState, setGameState] = useState<GameState>("start")
  const [currentDialogue, setCurrentDialogue] = useState(0)
  const [selectedProject, setSelectedProject] = useState<ProjectCategory>("architecture")
  const [selectedMoreProject, setSelectedMoreProject] = useState<MoreProjectCategory>("python")
  const [isMuted, setIsMuted] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [bgMusic] = useState(() => {
    if (typeof window !== 'undefined') {
      return new window.Audio("/assets/music/rizzlas-c418-224649.mp3");
    }
    return null;
  })
  const [achievements, setAchievements] = useState([
    { title: "First Project", description: "Completed your first project", icon: "🏆" },
    { title: "Tech Explorer", description: "Mastered multiple technologies", icon: "🔮" },
    { title: "Game Developer", description: "Created your first game", icon: "🎮" },
  ])

  // Background music control
  useEffect(() => {
    if (!bgMusic) return;
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    if (!isMuted) {
      bgMusic.play().catch(() => {});
    }
    return () => bgMusic.pause();
  }, [isMuted, bgMusic]);

  // Keyboard navigation
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case "enter":
        case " ":
          if (gameState === "start") setGameState("home")
          break
        case "h":
          setGameState("home")
          break
        case "t":
        case "tab":
          event.preventDefault()
          setGameState("about")
          break
        case "q":
          setGameState("projects")
          break
        case "b":
          setGameState("blogs")
          break
        case "c":
          setGameState("contact")
          break
        case "escape":
          setGameState("home")
          break
      }
    },
    [gameState],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [handleKeyPress])

  const projects: Record<ProjectCategory, Project[]> = {
    architecture: [
      {
        title: "ArchDo",
        description: "AR-powered home improvement and visualization tool with utility scanning features",
        tech: ["Unity", "ARKit", "ARCore", "C#"],
        status: "IN DEVELOPMENT",
        image: "/assets/projects/archdo.png",
      },
      {
        title: "AReState",
        description: "Real estate platform combining blockchain records and AR building previews",
        tech: ["Three.js", "Ethereum", "IPFS"],
        status: "PROTOTYPE",
        image: "/assets/projects/arestate.png",
      },
    ],
    software: [
      {
        title: "Cattle Classifier",
        description: "Identifies dairy cow species via facial image classification using CNN",
        tech: ["Python", "TensorFlow", "OpenCV"],
        status: "ONGOING",
        image: "/assets/projects/cattle.png",
      },
      {
        title: "Text-to-Music Generator",
        description: "Converts descriptive text to sound using ML models",
        tech: ["Python", "Magenta"],
        status: "PROTOTYPE",
        image: "/assets/projects/music.png",
      },
    ],
    games: [
      {
        title: "OVVERULED",
        description: "A two-player lawyer simulation with AI judging the winner based on argument logic",
        tech: ["Godot", "GDScript", "AI"],
        status: "IN DEVELOPMENT",
        image: "/assets/projects/ovveruled.webp",
      },
      {
        title: "TerminalCraft",
        description: "A text-based Minecraft-like game with assembly-style interface. Try the live demo!",
        tech: ["Python", "Terminal", "ASCII"],
        status: "LIVE DEMO",
        image: "/assets/projects/terminalcraft.png",
        demoUrl: "https://terminalcraft-azure.vercel.app/mc-terminal.html"
      },
    ],
    more: [
      {
        title: "Terminal Craft",
        description: "TerminalCraft is a humorous, interactive Minecraft-style terminal game for the web. Chat with a sassy version of Steve, who roasts you, triggers random Minecraft events, and responds to your commands in a retro terminal interface.",
        tech: ["React", "TensorFlow.js", "WebGL"],
        status: "COMPLETED",
        image: "/assets/projects/terminalcraft.png",
      },
      {
        title: "Smart Home Hub",
        description: "IoT-based home automation system with voice control and energy monitoring",
        tech: ["Python", "Raspberry Pi", "MQTT"],
        status: "ONGOING",
        image: "/assets/projects/smart-home.png",
      },
      {
        title: "Blockchain Explorer",
        description: "Real-time blockchain transaction viewer with analytics dashboard",
        tech: ["Node.js", "Web3.js", "D3.js"],
        status: "PROTOTYPE",
        image: "/assets/projects/blockchain.png",
      },
      {
        title: "AR Education Platform",
        description: "Interactive learning platform using AR for enhanced student engagement",
        tech: ["Unity", "ARKit", "Firebase"],
        status: "IN DEVELOPMENT",
        image: "/assets/projects/ar-edu.png",
      },
    ],
  }

  const moreProjects: Record<MoreProjectCategory, MoreProject[]> = {
    c: [
      {
        title: "Custom Memory Allocator",
        description: "Implementation of a custom memory allocator with garbage collection",
        tech: ["C", "Data Structures", "Memory Management"],
        status: "COMPLETED",
      },
      {
        title: "File System Simulator",
        description: "A basic file system implementation with directory structure and file operations",
        tech: ["C", "File I/O", "System Programming"],
        status: "COMPLETED",
      },
    ],
    cpp: [
      {
        title: "Game Engine Core",
        description: "Custom game engine implementation with ECS architecture",
        tech: ["C++", "OpenGL", "ECS"],
        status: "IN DEVELOPMENT",
      },
      {
        title: "Network Protocol Analyzer",
        description: "Real-time network packet analyzer with protocol detection",
        tech: ["C++", "Networking", "Wireshark API"],
        status: "ONGOING",
      },
    ],
    python: [
      {
        title: "AI Art Generator",
        description: "Web-based tool for generating and manipulating AI art with custom prompts",
        tech: ["Python", "TensorFlow", "Flask"],
        status: "COMPLETED",
      },
      {
        title: "Smart Home Hub",
        description: "IoT-based home automation system with voice control and energy monitoring",
        tech: ["Python", "Raspberry Pi", "MQTT"],
        status: "ONGOING",
      },
      {
        title: "Data Analysis Pipeline",
        description: "Automated data processing and visualization pipeline for large datasets",
        tech: ["Python", "Pandas", "Matplotlib"],
        status: "COMPLETED",
      },
    ],
    fullstack: [
      {
        title: "Blockchain Explorer",
        description: "Real-time blockchain transaction viewer with analytics dashboard",
        tech: ["Node.js", "React", "Web3.js"],
        status: "PROTOTYPE",
      },
      {
        title: "E-commerce Platform",
        description: "Full-featured online shopping platform with payment integration",
        tech: ["MERN Stack", "Stripe", "Redux"],
        status: "IN DEVELOPMENT",
      },
      {
        title: "Social Media Dashboard",
        description: "Analytics and management dashboard for social media platforms",
        tech: ["Next.js", "GraphQL", "MongoDB"],
        status: "ONGOING",
      },
    ],
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Starry Background */}
      <div className="stars">
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
      </div>

      {/* Sound Control */}
      <button
        className="sound-control"
        onClick={() => setIsMuted(!isMuted)}
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? "🔇" : "🔊"}
      </button>

      {/* Tooltips */}
      <div className="fixed top-4 right-4 game-tooltip">
        Level: {String(gameState).toUpperCase()}
      </div>

      {/* Add scanlines effect */}
      <div className="scanlines" />
      
      {/* START SCREEN */}
      {gameState === "start" && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-2xl w-full mx-auto p-4 sm:p-8 flex flex-col items-center justify-center">
            <div className="mb-8 w-full">
              <div className="text-primary text-6xl mb-4 text-glow">◤◢◤◢◤◢◤◢◤◢</div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-primary text-glow backdrop-blur-sm">YUVRAJ.EXE</h1>
              <div className="text-xl text-secondary mb-2 text-glow">XR & GAME DEVELOPER</div>
              <div className="text-sm text-muted-foreground mb-8">ARCHITECTURE-XR-GAMEDEV-WEB3</div>
            </div>
            <div className="space-y-4 w-full flex flex-col items-center">
              <GameButton
                onClick={() => setGameState("home")}
                variant="primary"
                keyHint="ENTER"
                className="text-xl px-8 py-4 hover-lift w-full max-w-xs"
              >
                ▶ START GAME
              </GameButton>
            </div>
          </div>
        </div>
      )}

      {/* MAIN GAME INTERFACE */}
      {gameState !== "start" && (
        <div className="min-h-screen">
          {/* Game HUD */}
          <div className="nav-menu">
            <div className="flex items-center justify-between max-w-6xl mx-auto p-3">
              <div className="flex items-center space-x-4">
                <div className="text-primary font-bold text-glow">PORTFOLIO.GAME</div>
                <div className="text-xs text-muted-foreground">LEVEL: {String(gameState).toUpperCase()}</div>
                <div className="status-indicator" />
              </div>

              <div className="flex space-x-2">
                <GameButton onClick={() => setGameState("home")} variant="secondary" keyHint="H">
                  HOME
                </GameButton>
                <GameButton onClick={() => setGameState("about")} variant="secondary" keyHint="T">
                  ABOUT
                </GameButton>
                <GameButton onClick={() => setGameState("projects")} variant="secondary" keyHint="Q">
                  PROJECTS
                </GameButton>
                <GameButton onClick={() => setGameState("blogs")} variant="secondary" keyHint="B">
                  BLOGS
                </GameButton>
                <GameButton onClick={() => setGameState("contact")} variant="secondary" keyHint="C">
                  CONTACT
                </GameButton>
              </div>
            </div>
          </div>

          {/* GAME CONTENT */}
          <div className="pt-20 min-h-screen">
            {/* HOME LEVEL */}
            {gameState === "home" && (
              <div className="container mx-auto px-4 py-12 max-w-6xl">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Left Column - Main Content */}
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 text-glow">
                        <span className="text-secondary">[</span>YUVRAJ SHARMA<span className="text-secondary">]</span>
                      </h1>
                      <div className="text-xl text-secondary mb-2">XR & GAME DEVELOPER</div>
                      <div className="text-sm text-muted-foreground leading-relaxed">
                        Crafting immersive experiences at the intersection of technology and creativity.
                        Specializing in AR/VR development, game design, and interactive digital solutions.
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <GameButton 
                        onClick={() => window.open("https://github.com/yuvrajsharmaaa")}
                        variant="primary"
                        className="hover-lift"
                      >
                        <Github className="w-4 h-4 mr-2" />
                        GITHUB
                      </GameButton>
                      <GameButton 
                        onClick={() => window.open("https://linkedin.com/in/yuvrajsharma03")}
                        variant="secondary"
                        className="hover-lift"
                      >
                        <Linkedin className="w-4 h-4 mr-2" />
                        LINKEDIN
                      </GameButton>
                      <GameButton 
                        onClick={() => setGameState("contact")}
                        variant="secondary"
                        className="hover-lift"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        CONTACT
                      </GameButton>
                    </div>
                  </div>

                  {/* Right Column - Stats Card */}
                  <div className="card-game p-6 backdrop-blur-md">
                    <div className="text-primary font-bold mb-6 text-center text-xl">EXPERTISE</div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="text-secondary text-sm">AR/VR DEVELOPMENT</div>
                        <div className="text-xs text-muted-foreground">
                          • Unity & Unreal Engine
                          <br />• ARKit & ARCore
                          <br />• 3D Modeling
                          <br />• Spatial Computing
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-secondary text-sm">GAME DEVELOPMENT</div>
                        <div className="text-xs text-muted-foreground">
                          • Game Design
                          <br />• C# & C++
                          <br />• Godot Engine
                          <br />• Game Mechanics
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-secondary text-sm">WEB3 & BLOCKCHAIN</div>
                        <div className="text-xs text-muted-foreground">
                          • Smart Contracts
                          <br />• DApp Development
                          <br />• NFT Integration
                          <br />• Web3 Architecture
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-secondary text-sm">SOFTWARE ENGINEERING</div>
                        <div className="text-xs text-muted-foreground">
                          • Full-Stack Development
                          <br />• Python & JavaScript
                          <br />• System Architecture
                          <br />• API Design
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ABOUT LEVEL */}
            {gameState === "about" && (
              <div className="container mx-auto px-4 py-12 max-w-5xl">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-primary mb-4">CHARACTER_PROFILE.DAT</h2>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  {/* XR Developer Class */}
                  <Card className="card-game">
                    <CardHeader>
                      <CardTitle className="text-primary font-mono flex items-center">
                        <Sparkles className="mr-2" />
                        XR_DEVELOPER
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-3">
                      <div className="text-foreground">
                        Specialized in creating immersive AR/VR experiences that bridge the gap between physical and digital worlds.
                      </div>
                      <div className="space-y-1">
                        <div className="text-primary">ABILITIES:</div>
                        <div className="text-xs space-y-1">
                          <div>• AR Development ████████░░</div>
                          <div>• VR Experiences ███████░░░</div>
                          <div>• Unity/Unreal ████████░░</div>
                          <div>• 3D Modeling ██████░░░░</div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">TOOLS: Unity, Unreal Engine, ARKit, ARCore</div>
                    </CardContent>
                  </Card>

                  {/* Game Developer Class */}
                  <Card className="card-game">
                    <CardHeader>
                      <CardTitle className="text-secondary font-mono flex items-center">
                        <Gamepad2 className="mr-2" />
                        GAME_DEVELOPER
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-3">
                      <div className="text-foreground">
                        Creating engaging game experiences that combine storytelling with technical innovation.
                      </div>
                      <div className="space-y-1">
                        <div className="text-secondary">ABILITIES:</div>
                        <div className="text-xs space-y-1">
                          <div>• Game Design ██████░░░░</div>
                          <div>• Unity/Godot ███████░░░</div>
                          <div>• C++/C# ████████░░</div>
                          <div>• UI/UX ███████░░░</div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">ENGINES: Unity, Godot, Custom Engines</div>
                    </CardContent>
                  </Card>

                  {/* Tech Explorer Class */}
                  <Card className="card-game">
                    <CardHeader>
                      <CardTitle className="text-accent font-mono flex items-center">
                        <Brain className="mr-2" />
                        TECH_EXPLORER
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-3">
                      <div className="text-foreground">
                        Exploring the intersection of emerging technologies and creative expression.
                      </div>
                      <div className="space-y-1">
                        <div className="text-accent">ABILITIES:</div>
                        <div className="text-xs space-y-1">
                          <div>• Web3 ██████░░░░</div>
                          <div>• AI/ML ██████░░░░</div>
                          <div>• Python ████████░░</div>
                          <div>• Blockchain ██████░░░░</div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">TECH: Web3, AI/ML, Blockchain, Python</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-12 text-center">
                  <DialogueBox
                    character="SYSTEM"
                    message="This hybrid class combination allows for unique problem-solving approaches, bridging physical and digital design methodologies."
                    showNext={false}
                  />
                </div>
              </div>
            )}

            {/* PROJECTS LEVEL */}
            {gameState === "projects" && (
              <div className="container mx-auto px-4 py-12 max-w-6xl">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-primary mb-4">QUEST_LOG.DB</h2>
                  <div className="text-muted-foreground">Choose your adventure path:</div>
                </div>

                {/* Project Category Selector */}
                <div className="flex justify-center mb-8 space-x-4">
                  <GameButton
                    onClick={() => setSelectedProject("architecture")}
                    variant={selectedProject === "architecture" ? "primary" : "secondary"}
                  >
                    <Building className="w-4 h-4" />
                    ARCHITECTURE
                  </GameButton>
                  <GameButton
                    onClick={() => setSelectedProject("software")}
                    variant={selectedProject === "software" ? "primary" : "secondary"}
                  >
                    <Code className="w-4 h-4" />
                    SOFTWARE
                  </GameButton>
                  <GameButton
                    onClick={() => setSelectedProject("games")}
                    variant={selectedProject === "games" ? "primary" : "secondary"}
                  >
                    <Gamepad2 className="w-4 h-4" />
                    GAMES
                  </GameButton>
                  <GameButton
                    onClick={() => setSelectedProject("more")}
                    variant={selectedProject === "more" ? "primary" : "secondary"}
                  >
                    <Zap className="w-4 h-4" />
                    MORE
                  </GameButton>
                </div>

                {/* Project Grid */}
                {selectedProject !== "more" ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {projects[selectedProject].map((project, index) => (
                      <Card
                        key={index}
                        className="card-game hover:border-primary transition-colors"
                      >
                        <CardHeader>
                          <div className="relative w-full h-48 bg-secondary/20 rounded mb-4 overflow-hidden">
                            <img
                              src={project.image || "/placeholder.svg"}
                              alt={project.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/placeholder.svg";
                                target.onerror = null;
                              }}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-primary text-lg">{project.title}</CardTitle>
                            <Badge
                              variant="outline"
                              className={`
                                ${
                                  project.status === "COMPLETED" ||
                                  project.status === "DEPLOYED" ||
                                  project.status === "RELEASED" ||
                                  project.status === "LIVE DEMO"
                                    ? "text-primary border-primary"
                                    : project.status === "IN DEVELOPMENT" || project.status === "ONGOING"
                                      ? "text-secondary border-secondary"
                                      : "text-accent border-accent"
                                }
                              `}
                            >
                              {project.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-foreground text-sm mb-4">{project.description}</p>
                          <div className="space-y-2">
                            <div className="text-xs text-muted-foreground">TECH STACK:</div>
                            <div className="flex flex-wrap gap-1">
                              {project.tech.map((tech, techIndex) => (
                                <Badge
                                  key={techIndex}
                                  variant="outline"
                                  className="text-xs text-accent border-accent"
                                >
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                            {project.demoUrl && (
                              <div className="mt-4">
                                <GameButton
                                  onClick={() => window.open(project.demoUrl, '_blank')}
                                  variant="primary"
                                  className="w-full"
                                >
                                  <Gamepad2 className="w-4 h-4 mr-2" />
                                  PLAY NOW
                                </GameButton>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div>
                    {/* More Projects Language Selector */}
                    <div className="flex justify-center mb-8 space-x-4">
                      <GameButton
                        onClick={() => setSelectedMoreProject("c")}
                        variant={selectedMoreProject === "c" ? "primary" : "secondary"}
                      >
                        <Terminal className="w-4 h-4" />
                        C
                      </GameButton>
                      <GameButton
                        onClick={() => setSelectedMoreProject("cpp")}
                        variant={selectedMoreProject === "cpp" ? "primary" : "secondary"}
                      >
                        <Cpu className="w-4 h-4" />
                        C++
                      </GameButton>
                      <GameButton
                        onClick={() => setSelectedMoreProject("python")}
                        variant={selectedMoreProject === "python" ? "primary" : "secondary"}
                      >
                        <Brain className="w-4 h-4" />
                        PYTHON
                      </GameButton>
                      <GameButton
                        onClick={() => setSelectedMoreProject("fullstack")}
                        variant={selectedMoreProject === "fullstack" ? "primary" : "secondary"}
                      >
                        <Code className="w-4 h-4" />
                        FULLSTACK
                      </GameButton>
                    </div>

                    {/* More Projects Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {moreProjects[selectedMoreProject].map((project, index) => (
                        <Card
                          key={index}
                          className="card-game hover:border-primary transition-colors"
                        >
                          <CardHeader>
                            <div className="relative w-full h-48 bg-secondary/20 rounded mb-4 overflow-hidden">
                              <img
                                src={project.image || "/placeholder.svg"}
                                alt={project.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/placeholder.svg";
                                  target.onerror = null;
                                }}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-primary text-lg">{project.title}</CardTitle>
                              <Badge
                                variant="outline"
                                className={`
                                  ${
                                    project.status === "COMPLETED" ||
                                    project.status === "DEPLOYED" ||
                                    project.status === "RELEASED"
                                      ? "text-primary border-primary"
                                      : project.status === "IN DEVELOPMENT" || project.status === "ONGOING"
                                        ? "text-secondary border-secondary"
                                        : "text-accent border-accent"
                                  }
                                `}
                              >
                                {project.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-foreground text-sm mb-4">{project.description}</p>
                            <div className="space-y-2">
                              <div className="text-xs text-muted-foreground">TECH STACK:</div>
                              <div className="flex flex-wrap gap-1">
                                {project.tech.map((tech, techIndex) => (
                                  <Badge
                                    key={techIndex}
                                    variant="outline"
                                    className="text-xs text-accent border-accent"
                                  >
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* BLOGS LEVEL */}
            {gameState === "blogs" && (
              <div className="container mx-auto px-4 py-12 max-w-6xl">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-primary mb-4">BLOG_ARCHIVE.SYS</h2>
                  <div className="text-muted-foreground">Latest thoughts and insights on tech and development</div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Blog Post 1 */}
                  <Card className="card-game hover:border-primary transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-primary text-lg">The Future of AR in Architecture</CardTitle>
                        <Badge variant="outline" className="text-secondary border-secondary">
                          AR/VR
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">Published: March 15, 2024</div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground text-sm mb-4">
                        Exploring how augmented reality is revolutionizing architectural visualization and client presentations...
                      </p>
                      <GameButton
                        onClick={() => window.open("/blog/ar-architecture")}
                        variant="secondary"
                        className="w-full"
                      >
                        READ MORE
                      </GameButton>
                    </CardContent>
                  </Card>

                  {/* Blog Post 2 */}
                  <Card className="card-game hover:border-primary transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-primary text-lg">Game Development with Godot</CardTitle>
                        <Badge variant="outline" className="text-secondary border-secondary">
                          GAME DEV
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">Published: March 10, 2024</div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground text-sm mb-4">
                        A deep dive into why Godot is becoming a popular choice for indie game developers...
                      </p>
                      <GameButton
                        onClick={() => window.open("/blog/godot-game-dev")}
                        variant="secondary"
                        className="w-full"
                      >
                        READ MORE
                      </GameButton>
                    </CardContent>
                  </Card>

                  {/* Blog Post 3 */}
                  <Card className="card-game hover:border-primary transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-primary text-lg">Web3 in Gaming: The Next Frontier</CardTitle>
                        <Badge variant="outline" className="text-secondary border-secondary">
                          WEB3
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">Published: March 5, 2024</div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground text-sm mb-4">
                        How blockchain technology is transforming the gaming industry and player ownership...
                      </p>
                      <GameButton
                        onClick={() => window.open("/blog/web3-gaming")}
                        variant="secondary"
                        className="w-full"
                      >
                        READ MORE
                      </GameButton>
                    </CardContent>
                  </Card>

                  {/* Blog Post 4 */}
                  <Card className="card-game hover:border-primary transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-primary text-lg">Building XR Experiences with Unity</CardTitle>
                        <Badge variant="outline" className="text-secondary border-secondary">
                          XR DEV
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">Published: February 28, 2024</div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground text-sm mb-4">
                        Best practices and tips for creating immersive XR experiences using Unity...
                      </p>
                      <GameButton
                        onClick={() => window.open("/blog/unity-xr")}
                        variant="secondary"
                        className="w-full"
                      >
                        READ MORE
                      </GameButton>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* CONTACT LEVEL */}
            {gameState === "contact" && (
              <div className="container mx-auto px-4 py-12 max-w-3xl">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-primary mb-4">MESSAGE_TERMINAL.SYS</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Contact Form Box */}
                  <div className="card-game p-6 flex flex-col justify-between">
                    <div>
                      <div className="text-primary font-bold mb-2 text-lg">Contact Directly</div>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          // TODO: Integrate with EmailJS or Formspree
                          console.log('Form submitted:', formData);
                          alert('Message sent! (Integrate with EmailJS or Formspree)');
                          setFormData({ name: '', email: '', message: '' });
                        }}
                        className="space-y-4"
                      >
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          required
                          placeholder="Your Name"
                          className="w-full p-2 rounded bg-background border border-primary/30 focus:border-primary outline-none"
                        />
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          required
                          placeholder="Your Email"
                          className="w-full p-2 rounded bg-background border border-primary/30 focus:border-primary outline-none"
                        />
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                          required
                          placeholder="Type your message..."
                          rows={4}
                          className="w-full p-2 rounded bg-background border border-primary/30 focus:border-primary outline-none"
                        />
                        <button
                          type="submit"
                          className="rpg-button bg-primary text-background hover:bg-primary/80 w-full mt-2"
                        >
                          Send Message
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Resume/CV Box */}
                  <div className="card-game p-6 flex flex-col items-center justify-center">
                    <div className="text-primary font-bold mb-2 text-lg">Resume / CV</div>
                    <div className="text-muted-foreground mb-4 text-center">Download or view my latest resume/CV.</div>
                    <a
                      href="/assets/YOUR_RESUME.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rpg-button bg-secondary text-primary hover:bg-secondary/80 w-full text-center"
                      download
                    >
                      Download Resume
                    </a>
                  </div>
                </div>

                <div className="mt-12 text-center">
                  <div className="card-game inline-block p-4 text-sm">
                    <div className="text-primary mb-2">CONNECTION STATUS:</div>
                    <div className="space-y-1 text-xs">
                      <div className="text-primary">🟢 ONLINE</div>
                      <div className="text-secondary">⚡ RESPONSE TIME: {"< 24H"}</div>
                      <div className="text-accent">🎯 AVAILABILITY: OPEN TO QUESTS</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
