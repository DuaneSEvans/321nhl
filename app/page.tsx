import { z } from "zod"
import Standings from "./components/Standings"
import { RawStandingSchema, Standing } from "./shared"

export default async function Home() {
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

  return <Standings officialStandings={officialStandings} />
}
