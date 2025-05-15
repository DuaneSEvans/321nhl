import { z } from "zod"

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
  conferenceName: z.string(),
  divisionName: z.string(),
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

export const scopes = ["Wild Card", "Division", "Conference", "League"] as const
export type Scope = (typeof scopes)[number]

export const conferences = ["Western", "Eastern"] as const
export type Conference = (typeof conferences)[number]

export const divisions = [
  "Pacific",
  "Central",
  "Atlantic",
  "Metropolitan",
] as const
export type Division = (typeof divisions)[number]
