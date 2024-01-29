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
    change: z.number(),
  })
)

export type Standing = z.infer<typeof StandingSchema>
