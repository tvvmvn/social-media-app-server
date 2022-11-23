const {Comment, FavoriteComment} = require("../models/model");

exports.comment_list = async (req, res, next) => {
  try {
    const loginUser = req.user;
    const id = req.params.id;
    const comments = await Comment
      .find({article: id})
      .populate("user")
      .sort([["created", "descending"]])
      .limit(req.query.limit)
      .skip(req.query.skip)
      .lean();

    for (let comment of comments) {
      const favoriteComment = await FavoriteComment
        .findOne({user: loginUser._id, comment: comment._id});

      comment.isFavorite = favoriteComment ? true : false;
    }
    
    res.json(comments);

  } catch (error) {
    next(error)
  }
}

exports.create = async (req, res, next) => {
  try {
    const loginUser = req.user;
    const id = req.params.id;
    const content = req.body.content;

    const comment = new Comment({
      article: id,
      content: content,
      user: loginUser._id
    })

    await comment.save();

    res.json(await comment.populate("user"));

  } catch (error) {
    next(error)
  }
}

exports.delete = async (req, res, next) => {
  try {
    const loginUser = req.user;
    const id = req.params.id;
    const comment = await Comment.findById(id);

    if (loginUser._id.toString() !== comment.user.toString()) {
      const err = new Error("User not match")
      err.status = 400;
      return next(err);
    }

    await comment.delete();

    res.end();

  } catch (error) {
    next(error)
  }
}

exports.favorite = async (req, res, next) => {
  try {
    const loginUser = req.user;
    const id = req.params.id;
    const comment = await Comment.findById(id);
    const favoriteComment = await FavoriteComment
    .findOne({ user: loginUser._id, comment: comment._id });

    if (favoriteComment) {
      const err = new Error("Something's broken");
      err.status = 400;
      return next(err)
    }

    const newFavoriteComment = new FavoriteComment({
      user: loginUser._id,
      comment: comment._id
    })

    await newFavoriteComment.save();

    comment.favoriteCount++;

    await comment.save();

    res.end();

  } catch (error) {
    next(error)
  }
}

exports.unfavorite = async (req, res, next) => {
  try {
    const loginUser = req.user;
    const id = req.params.id;
    const comment = await Comment.findById(id)
    const favoriteComment = await FavoriteComment
      .findOne({user: loginUser._id, comment: comment._id});

    if (!favoriteComment) {
      const err = new Error("Something's broken");
      err.status = 400;
      return next(err)
    }

    await favoriteComment.delete();

    comment.favoriteCount--;
    await comment.save();

    res.end();

  } catch (error) {
    next(error)
  }
}