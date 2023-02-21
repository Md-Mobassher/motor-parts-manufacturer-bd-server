const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/dbConnect");

module.exports.getAllTools = async (req, res, next) => {
    try {
      const { limit, page } = req.query;
      const db = getDb();
  

      const tools = await db
        .collection("tools")
        .find({})
        .toArray();
  
      res.status(200).json({ success: true, data: tools });

    } catch (error) {
      next(error);
    }
  };
  

  module.exports.saveATool = async (req, res, next) => {
    try {
      const db = getDb();
      const newTool = req.body;

      const requiredProperties = ["name", "price","img", "quantity",  "description"];
      const missingProperties = requiredProperties.filter(prop => !(prop in newTool));
  
      if (missingProperties.length > 0) {
        return res.status(400).send({
          success: false,
          error: `The following properties are missing: ${missingProperties.join(", ")}`
        });
      }

      const result = await db.collection("tools").insertOne(newTool);
 
  
      if (!result.insertedId) {
        return res.status(400).send({ status: false, error: "Something went wrong!" });
      }
  
      res.send({ success: true, message: `Tool added with id: ${result.insertedId}` });
    } catch (error) {
      next(error);
    }
  };