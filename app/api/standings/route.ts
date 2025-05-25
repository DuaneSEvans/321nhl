import { z } from "zod"
import { RawStandingSchema, Standing } from "../../shared"

// This really should be a GET but Vercel insists on caching and using stale
// data: https://github.com/vercel/vercel/discussions/10117
export async function POST() {
  // https://gitlab.com/dword4/nhlapi/-/blob/master/new-api.md?ref_type=heads#standings
  const res = await fetch("https://api-web.nhle.com/v1/standings/now")
  const data = await res.json()

  const parsedStandings = z.array(RawStandingSchema).parse(data.standings)

  const officialStandings: Standing[] = parsedStandings.map((standing) => {
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
      change: 0,
    }
  })

  return Response.json({ officialStandings })
}
