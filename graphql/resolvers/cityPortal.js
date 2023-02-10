//models
const User = require("../../models/user");
const cp = require("../../models/cityPortal");
const { argsToArgsConfig } = require("graphql/type/definition");

const { transformPortal, attachUsers } = require("./merge");

module.exports = {
  addCityPortal: async (args, req) => {
    try {
        //does portal exist?
      const existingPortal = await cp.find({ city: args.city });
      if (existingPortal.length == 0) {
        const cityPortal = new cp({
          city: args.city,
          state: args.state,
        });
        try {
          const savedPortal = await cityPortal.save();
          const result = await cp.findById(savedPortal.id);
          return result;
        } catch (err) {
          throw err;
        }
      } else {
        throw new Error("This portal exists already")
      }
    } catch (err) {
      throw err;
    }
  },
  getCityPortals: async () => {
    const portals = await cp.find();
    return portals.map((portal) => {
      return transformPortal(portal);
    });
  },
};
