import { TypeTags } from "@cz3/meta-client";
import dayjs from "dayjs";
import { FastifyInstance } from "fastify";
import { APIError } from "../../api.js";
import { authenticateAnonymous, MinimumAuthenticationResult } from "../../utils/auth/index.js";
import { meta } from "../../utils/meta.js";
import { munzeeFetch } from "../../utils/munzee.js";

export default function PlayerNomads(fastify: FastifyInstance) {
  fastify.get<{
    Params: { year: string };
  }>("/player/:user/nomads/:year", async request => {
    const year = Number(request.params.year);
    const user_id = await request.getUserID();
    const token = await authenticateAnonymous();

    const specialsRequest = await munzeeFetch({
      endpoint: "user/specials",
      token,
      params: {
        user_id,
      },
    });
    const specials = await specialsRequest.getMunzeeData();

    if (!specials.data?.length) {
      throw APIError.MunzeeInvalid();
    }

    const allNomads = [];
    for (const special of specials.data) {
      const type = meta.get(special.logo);
      if (type?.hasTag(TypeTags.BouncerNomad)) {
        const nomads = await getNomads(token, user_id, year, special.name);
        if (nomads.length === 0) {
          break;
        }
        allNomads.push(...nomads);
      }
    }

    allNomads.sort((a, b) => new Date(a.captured_at).valueOf() - new Date(b.captured_at).valueOf());

    return { nomads: allNomads };
  });
}

async function getNomads(
  token: MinimumAuthenticationResult,
  user_id: number,
  year: number,
  type: string
) {
  const allNomads = [];
  for (let page = 0; page < 5; page++) {
    const nomadsRequest = await munzeeFetch({
      endpoint: "user/captures/special",
      token,
      params: {
        user_id,
        type,
        page,
      },
    });
    const nomads = await nomadsRequest.getMunzeeData();

    if (!nomads.data) break;

    const yearNomads = nomads.data.munzees.filter(
      n => dayjs.mhqParse(n.captured_at).year() === year
    );
    allNomads.push(...yearNomads);

    if (yearNomads.length < nomads.data.munzees.length) break;

    if (!nomads.data?.has_more) break;
  }
  return allNomads;
}
