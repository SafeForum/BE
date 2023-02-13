//models
const User = require("../../models/user");
const MB = require("../../models/MessageBoard/messageBoard")
const cp = require("../../models/cityPortal");

const { transformPortal } = require("./merge");

module.exports = {
  addCityPortal: async (args, req) => {
    try {
        //does portal exist?
      const existingPortal = await cp.find({ city: args.city });
      if (existingPortal.length == 0) {
        const cityPortal = new cp({
          city: args.city,
          state: args.state,
          messageBoard: null,
        });
        try {
          const savedPortal = await cityPortal.save();
          const result = await cp.findById(savedPortal);
          const messageBoard = new MB({
            threads: null,
            cityPortal: result
          })
          const savedMessageBoard = await messageBoard.save()
          result.messageBoard = savedMessageBoard;
          const finalPortal = await result.save();
          //does finalPortal have a message board?
          if (!finalPortal.messageBoard) {
            finaPortal
            throw new "City Portal has no Message Board"
          }
          return finalPortal;
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
  getSingleCityPortal: async (args) => {
    try {
      const portal = await cp.findById(args.portalId)
      return transformPortal(portal)
    } catch(err) {
      throw err
    }
  }
};
