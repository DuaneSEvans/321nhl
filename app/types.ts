import { z } from "zod"

export const StandingsSchema = z.object({
  standings: z.array(
    z.object({
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
  ),
})

export type Standings = z.infer<typeof StandingsSchema>
