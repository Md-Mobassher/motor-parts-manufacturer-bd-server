const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/dbConnect");

module.exports.getAllUsers = async (req, res, next) => {
    try {
      const { limit, page } = req.query;
      const db = getDb();  

      const users = await db
        .collection("users")
        .find({})
        .toArray();
  
      res.status(200).json({ success: true, data: users });

    } catch (error) {
      next(error);
    }
  };
  

  module.exports.saveAUser = async (req, res, next) => {
    try {
      const db = getDb();
      const newUser = req.body;

      const requiredProperties = [ "email"];
      const missingProperties = requiredProperties.filter(prop => !(prop in newUser));
  
      if (missingProperties.length > 0) {
        return res.status(400).send({
          success: false,
          error: `The following properties are missing: ${missingProperties.join(", ")}`
        });
      }

      const result = await db.collection("users").insertOne(newUser);
  
      if (!result.insertedId) {
        return res.status(400).send({ status: false, error: "Something went wrong!" });
      }
  
      res.send({ success: true, message: `User added with id: ${result.insertedId}` });

    } catch (error) {
      next(error);
    }
  };


  module.exports.getUserDetail = async (req, res, next) => {
    try {
      const db = getDb();
      const { id } = req.params;
  
      if(!ObjectId.isValid(id)){
        return res.status(400).json({ success: false, error: "Not a valid user id."});
      }
  
      const user = await db.collection("users").findOne({_id: ObjectId(id)});
  
      if(!user){
        return res.status(400).json({ success: false, error: "Couldn't find a user with this id"});
      }
  
      res.status(200).json({ success: true, data: user });
      
    } catch (error) {
      next(error);
    }
  };

  
module.exports.updateUser = async (req, res, next) => {
    try {
      const db = getDb();
      const { id } = req.params;
  
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: "Not a valid user id." });
      }
  
      const user = await db.collection("users").updateOne({ _id: ObjectId(id) }, { $set: req.body });
  
      if (!user.modifiedCount) {
        return res.status(400).json({ success: false, error: "Couldn't update the user" });
      }
  
      res.status(200).json({ success: true, message: "Successfully updated the user" });
    } catch (error) {
      next(error);
    }
  };


  
module.exports.deleteUser = async (req, res, next) => {
    try {
      const db = getDb();
      const { id } = req.params;
  
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: "Not a valid user id." });
      }
  
      const user = await db.collection("users").deleteOne({ _id: ObjectId(id) });
  
      if (!user.deletedCount) {
        return res.status(400).json({ success: false, error: "Couldn't delete the user" });
      }
  
      res.status(200).json({ success: true, message: "Successfully deleted the user" });
    } catch (error) {
      next(error);
    }
  };