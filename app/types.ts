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
})

export type RawStanding = z.infer<typeof RawStandingSchema>

export const StandingSchema = z.object({
  regulationLosses: z.number(),
  nonRegulationLosses: z.number(),
  points: z.number(),
  nonRegulationWins: z.number(),
  regulationWins: z.number(),
  teamCommonName: z.object({
    default: z.string(),
  }),
  teamAbbrev: z.object({
    default: z.string(),
  }),
  teamLogo: z.string(),
  leagueRank: z.number(),
})

export type Standing = z.infer<typeof StandingSchema>
