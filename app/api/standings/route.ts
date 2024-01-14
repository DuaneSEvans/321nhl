import { z } from "zod"
import { RawStandingSchema } from "../../types"

export async function GET() {
  const res = await fetch("https://api-web.nhle.com/v1/standings/now")
  const data = await res.json()

  const standings = z.array(RawStandingSchema).parse(data.standings)
  return Response.json({ standings })
}
