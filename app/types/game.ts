export type GameState = "start" | "home" | "about" | "projects" | "blogs" | "contact"
export type ProjectCategory = "architecture" | "software" | "games" | "more"
export type MoreProjectCategory = "c" | "cpp" | "python" | "fullstack"

export interface Project {
  title: string
  description: string
  tech: string[]
  status: string
  image: string
  demoUrl?: string
}

export interface MoreProject {
  title: string
  description: string
  tech: string[]
  status: string
  image?: string
} 