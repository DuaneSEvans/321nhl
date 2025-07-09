import { MotionProps } from "framer-motion"
import { z } from "zod"

export const scopes = ["Wild Card", "Division", "Conference", "League"] as const
export type Scope = (typeof scopes)[number]

export const conferences = ["Western", "Eastern"] as const
export const conferenceNamesSchema = z.enum(conferences)
export type Conference = z.infer<typeof conferenceNamesSchema>

export const divisions = [
  "Pacific",
  "Central",
  "Atlantic",
  "Metropolitan",
] as const
const divisionNamesSchema = z.enum(divisions)
export type Division = z.infer<typeof divisionNamesSchema>

export const RawStandingSchema = z.object({
  losses: z.number(),
  otLosses: z.number(),
  points: z.number(),
  regulationPlusOtWins: z.number(),
  regulationWins: z.number(),
  shootoutLosses: z.number(),
  shootoutWins: z.number(),
  teamCommonName: z.object({
    default: z.string(),
  }),
  teamAbbrev: z.object({
    default: z.string(),
  }),
  teamLogo: z.string(),
  wins: z.number(),
  conferenceName: conferenceNamesSchema,
  divisionName: divisionNamesSchema,
})

export type RawStanding = z.infer<typeof RawStandingSchema>

export const StandingSchema = RawStandingSchema.and(
  z.object({
    regulationLosses: z.number(),
    nonRegulationLosses: z.number(),
    nonRegulationWins: z.number(),
  })
)

export type Standing = z.infer<typeof StandingSchema>

export type StandingWithChange = Standing & {
  change: number
}

export enum PointSystem {
  REGULAR = "regular",
  THREE_TWO_ONE_ZERO = "321",
}

// TODO(dse): make flashy-er
export const THREE_TWO_ONE_ZERO_COLORS = {
  "--color-primary": "hsla(0, 0%, 100%, 1)",
  "--color-selected-system-text": "hsla(0, 0%, 100%, 1)",
  "--color-unselected-system-text": "hsla(210, 3%, 76%, 1)",
  "--color-secondary": "hsla(210, 3%, 76%, 1)",
  "--color-accent": "hsla(237, 84%, 63%, 1)",
  "--color-accent-secondary": "hsla(251, 23%, 63%, 1)",
  "--color-accent-tertiary": "hsla(265, 100%, 96%, 0.8)",
  "--color-nav-bg": "hsla(0, 0%, 0%, 1)",
  "--color-info-modal-bg": "hsla(270, 100%, 98%, 1)",
  "--color-info-accent": "hsla(237, 84%, 63%, 1)",
}

// TODO(dse): make boring-er
export const REGULAR_COLORS = {
  "--color-primary": "hsla(0, 0%, 100%, 1)",
  "--color-selected-system-text": "hsla(0, 0%, 0%, 1)",
  "--color-unselected-system-text": "hsla(210, 3%, 76%, 1)",
  "--color-secondary": "hsla(210, 3%, 76%, 1)",
  "--color-accent": "hsla(0, 0%, 100%, 1)",
  "--color-accent-secondary": "hsla(240, 4%, 77%, 1)",
  "--color-accent-tertiary": "hsla(240, 4%, 97%, 1)",
  "--color-nav-bg": "hsla(0, 0%, 0%, 1)",
  "--color-info-modal-bg": "hsla(270, 100%, 98%, 1)",
  "--color-info-accent": "hsla(237, 84%, 63%, 1)",
}

export const CSS_VARS = {
  "--max-content-width": "1280px",
}

export const baseMotionProps: MotionProps = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: {
    duration: 0.4,
    ease: [0.32, 0.72, 0, 1], // apple's default cubic-bezier
  },
}
