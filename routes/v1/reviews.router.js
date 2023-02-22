const express = require('express');
const reviewsControllers = require("../../controllers/reviews.controller")
const router = express.Router()


router.route("/")
/**
   * @api {get} /tools All tools
   * @apiDescription Get all the tools
   * @apiPermission user, admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [limit=10]  Users per page
   *
   * @apiSuccess {Object[]} all the tools.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
.get(reviewsControllers.getAllReviews)


router.route('/:id')
/**
   * @api {patch} /reviews/:id  update review
   * @apiDescription update review
   * @apiPermission user, admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [limit=10]  Users per page
   *
   * @apiSuccess {Object[]} all the tools.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   * */
.patch(reviewsControllers.updateReview)
/**
   * @api {delete} /reviews/:id  delete review
   * @apiDescription delete review
   * @apiPermission  admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [limit=10]  Users per page
   *
   * @apiSuccess {Object[]} all the tools.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   * */
.delete(reviewsControllers.deleteReview)


module.exports = router;