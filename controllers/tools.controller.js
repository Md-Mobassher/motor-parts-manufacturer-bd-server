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

      const requiredProperties = ["name", "price","img", "quantity", "description"];
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


  module.exports.getToolDetail = async (req, res, next) => {
    try {
      const db = getDb();
      const { id } = req.params;
  
      if(!ObjectId.isValid(id)){
        return res.status(400).json({ success: false, error: "Not a valid tool id."});
      }
  
      const tool = await db.collection("tools").findOne({_id: ObjectId(id)});
  
      if(!tool){
        return res.status(400).json({ success: false, error: "Couldn't find a tool with this id"});
      }
  
      res.status(200).json({ success: true, data: tool });
      
    } catch (error) {
      next(error);
    }
  };

  
module.exports.updateTool = async (req, res, next) => {
    try {
      const db = getDb();
      const { id } = req.params;
  
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: "Not a valid tool id." });
      }
  
      const tool = await db.collection("tools").updateOne({ _id: ObjectId(id) }, { $set: req.body });
  
      if (!tool.modifiedCount) {
        return res.status(400).json({ success: false, error: "Couldn't update the tool" });
      }
  
      res.status(200).json({ success: true, message: "Successfully updated the tool" });
    } catch (error) {
      next(error);
    }
  };


  
module.exports.deleteTool = async (req, res, next) => {
    try {
      const db = getDb();
      const { id } = req.params;
  
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: "Not a valid tool id." });
      }
  
      const tool = await db.collection("tools").deleteOne({ _id: ObjectId(id) });
  
      if (!tool.deletedCount) {
        return res.status(400).json({ success: false, error: "Couldn't delete the tool" });
      }
  
      res.status(200).json({ success: true, message: "Successfully deleted the tool" });
    } catch (error) {
      next(error);
    }
  };