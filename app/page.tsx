import { z } from "zod"
import Standings from "./components/Standings"
import { RawStandingSchema, Standing } from "./shared"

// Add timestamp to avoid vercel caching issue https://github.com/vercel/vercel/discussions/10117
export default async function Home() {
  // https://gitlab.com/dword4/nhlapi/-/blob/master/new-api.md?ref_type=heads#standings
  const res = await fetch(
    "https://api-web.nhle.com/v1/standings/now?ts=" + Date.now(),
    {
      cache: "no-store",
    }
  )
  const data = await res.json()
  console.log(data.standings[0])

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

  return <Standings officialStandings={officialStandings} />
}
