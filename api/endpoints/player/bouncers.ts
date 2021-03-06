import { FastifyInstance } from "fastify";
import { MunzeeSpecialBouncer } from "@cz3/api-types/munzee/specials.js";
import { getBouncers } from "../../utils/bouncers.js";
import { munzeeFetch } from "../../utils/munzee.js";
import { createRevGeocoder, LookupResult } from "@webkitty/geo-rev";
import geoTz from "geo-tz";

const geocoder = createRevGeocoder();

export default function PlayerBouncers(fastify: FastifyInstance) {
  fastify.get("/player/:user/bouncers", async request => {
    const user_id = await request.getUserID();
    const authenticationResult = await request.authenticateHeaders({ anonymous: true });

    const deploys = await (
      await munzeeFetch({
        endpoint: "user/deploys",
        params: { user_id, type_id: 505508 },
        token: authenticationResult,
      })
    ).getMunzeeData();
    const bouncers = await getBouncers();

    for (let page = 1; page < 6 && deploys?.data?.has_more; page++) {
      const pageDeploys = await (
        await munzeeFetch({
          endpoint: "user/deploys",
          params: { user_id, type_id: 505508, page },
          token: authenticationResult,
        })
      )?.getMunzeeData();
      if (!pageDeploys.data?.has_more) deploys.data.has_more = 0;
      deploys.data.munzees = deploys.data.munzees.concat(pageDeploys.data?.munzees ?? []);
    }
    const userBouncers = await Promise.all(
      deploys?.data?.munzees
        .slice()
        .reverse()
        .map(async i => {
          const munzee: typeof i & {
            bouncer?: MunzeeSpecialBouncer;
            location?: LookupResult;
            timezone?: string;
          } = i;
          munzee.bouncer = bouncers.find(
            b =>
              "mythological_munzee" in b &&
              b?.mythological_munzee?.munzee_id.toString() === i.munzee_id.toString()
          ) as MunzeeSpecialBouncer;
          if (munzee.bouncer) {
            munzee.location = (await geocoder).lookup({
              latitude: Number(munzee.bouncer.latitude),
              longitude: Number(munzee.bouncer.longitude),
            });
            munzee.timezone = geoTz
              .find(Number(munzee.bouncer.latitude), Number(munzee.bouncer.longitude))
              .join(", ");
          }
          return munzee;
        }) || []
    );
    return { bouncers: userBouncers };
  });
}
