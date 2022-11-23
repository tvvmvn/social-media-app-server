const { Follow, Article, Favorite } = require("../models/model");
const formidable = require("formidable");

exports.feed = async (req, res, next) => {
  try {
    const loginUser = req.user;
    const follows = await Follow.find({ follower: loginUser._id });

    const articles = await Article
      .find({ user: [...follows.map(follow => follow.following), loginUser._id]})
      .sort([["created", "descending"]])
      .populate("user")
      .skip(req.query.skip)
      .limit(req.query.limit)
      .lean();

    for (let article of articles) {
      const favorite = await Favorite
        .findOne({ user: loginUser._id, article: article._id });

      article.isFavorite = !!favorite;
    }

    res.json(articles)

  } catch (error) {
    next(error)
  }
}

exports.create = async (req, res, next) => {
  const form = formidable({ multiples: true });
  
  form.parse(req, async (err, fields, files) => {
    try { 
      const loginUser = req.user;

      if (err) {
        return next(err);
      }

      const images = files.images instanceof Array ? 
        files.images 
        : 
        new Array(files.images);

      if (!images[0].originalFilename) {
        const err = new Error("Image must be specified");
        err.status = 400;
        return next(err);
      }

      // validate image...
      
      const photos = images.map(photo => {
        const oldpath = photo.filepath;
        const ext = photo.originalFilename.split(".")[1]
        const newName = photo.newFilename + "." + ext;
        const newpath = __dirname + "/data/articles/" + newName;

        fs.renameSync(oldpath, newpath);

        return newName;
      })
          
      const article = new Article({
        description: fields.description,
        photos,
        user: loginUser._id
      })

      await article.save();

      res.json(photos)

    } catch (error) {
      next(error)
    }
  });
}

exports.article_list = async (req, res, next) => {
  try {
    console.log(req.cookies);
    console.log(req.headers);

    const articles = await Article.find()
      .sort([["created", "descending"]])
      .populate("user")
      .skip(req.query.skip)
      .limit(req.query.limit);

      res.json(articles);

  } catch (error) {
    next(error)
  }
}

exports.article = async (req, res, next) => {
  try {   
    const loginUser = req.user;
    const id = req.params.id;
    const article = await Article
      .findById(id)
      .populate("user")
      .lean();
    
    if (!article) {
      const err = new Error("Article not found");
      err.status = 404;
      return next(err);
    }

    const favorite = await Favorite
      .findOne({ user: loginUser._id, article: article._id })      
    
    article.isFavorite = !!favorite;

    res.json(article);
 
  } catch (error) {
    next(error)
  }
}

exports.delete = async (req, res, next) => {
  try {
    const id = req.params.id;
    const article = await Article
      .findById(id);

    if (!article) {
      const err = new Error("Article not found")
      err.status = 404;
      return next(err);
    }
    
    await article.delete();
    
    res.end();

  } catch (error) {
    next(error)
  }
}

exports.favorite = async (req, res, next) => {
  try { 
    const loginUser = req.user;
    const id = req.params.id;
    const article = await Article.findById(id)
    const favorite = await Favorite
      .findOne({ user: loginUser._id, article: article._id })

    if (favorite) {
      const err = new Error("Already favorite article");
      err.status = 400;
      return next(err)
    }

    const newFavorite = new Favorite({
      user: loginUser._id,
      article: article._id
    })

    await newFavorite.save();

    article.favoriteCount++;

    await article.save();

    res.end();

  } catch (error) {
    next(error)
  }
}

exports.unfavorite = async (req, res, next) => {
  try {
    const loginUser = req.user;
    const id = req.params.id
    const article = await Article.findById(id)
    const favorite = await Favorite
      .findOne({ user: loginUser._id, article: article._id })

    if (!favorite) {
      const err = new Error("No article to unfavorite");
      err.status = 400;
      return next(err);
    }

    await favorite.delete();

    article.favoriteCount--;
    await article.save();

    res.end();

  } catch (error) {
    next(error)
  }
}