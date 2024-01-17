import { z } from "zod"
import { RawStandingSchema, Standing } from "../../types"

export const fetchCache = "force-no-store"

export async function GET() {
  // https://gitlab.com/dword4/nhlapi/-/blob/master/new-api.md?ref_type=heads#standings
  const res = await fetch("https://api-web.nhle.com/v1/standings/now", {
    cache: "no-store",
  })
  const data = await res.json()

  const parsedStandings = z.array(RawStandingSchema).parse(data.standings)

  const officialStandings: Standing[] = parsedStandings.map((standing, i) => {
    const {
      losses,
      otLosses,
      regulationPlusOtWins,
      regulationWins,
      shootoutWins,
    } = standing

    return {
      ...standing,
      regulationLosses: losses,
      nonRegulationLosses: otLosses,
      nonRegulationWins: regulationPlusOtWins - regulationWins + shootoutWins,
      leagueRank: i + 1,
    }
  })

  return Response.json({ officialStandings })
}
