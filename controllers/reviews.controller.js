const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/dbConnect");

module.exports.getAllReviews = async (req, res, next) => {
    try {
      const { limit, page } = req.query;
      const db = getDb();  

      const reviews = await db
        .collection("reviews")
        .find({})
        .toArray();
  
      res.status(200).json({ success: true, data: reviews });

    } catch (error) {
      next(error);
    }
  };
  
  module.exports.updateReview = async (req, res, next) => {
    try {
      const db = getDb();
      const { id } = req.params;
  
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: "Not a valid review id." });
      }
      const rating = req.body.rating;
      if(rating > 5 || rating < 0){
        return res.status(400).json({ success:false, error: "Rating must be 0-5."})
      }
  
      const review = await db.collection("reviews").updateOne({ _id: ObjectId(id) }, { $set: req.body });
  
      if (!review.modifiedCount) {
        return res.status(400).json({ success: false, error: "Couldn't update the review" });
      }
  
      res.status(200).json({ success: true, message: "Successfully updated the review" });
    } catch (error) {
      next(error);
    }
  };

  module.exports.deleteReview = async (req, res, next) => {
    try {
      const db = getDb();
      const { id } = req.params;
  
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: "Not a valid review id." });
      }
  
      const review = await db.collection("reviews").deleteOne({ _id: ObjectId(id) });
  
      if (!review.deletedCount) {
        return res.status(400).json({ success: false, error: "Couldn't delete the review" });
      }
  
      res.status(200).json({ success: true, message: "Successfully deleted the review" });
    } catch (error) {
      next(error);
    }
  };