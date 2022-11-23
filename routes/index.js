const express = require('express')
const router = express.Router();
const passport = require("passport");
const auth = passport.authenticate("jwt", { session: false });
require("../auth/passportJwt");
const auth_controller = require("../controllers/auth_controller");
const account_controller = require("../controllers/account_controller");
const article_controller = require("../controllers/article_controller");
const comment_controller = require("../controllers/comment_controller");
const search_controller = require("../controllers/search_controller");
const profile_controller = require("../controllers/profile_controller");

// router handles 404 NotFound
// auth handles 401 NotAuthorized
// They do not use error handler

// INDEX
router.get('/', (req, res) => {
  res.json({ message: "hello express" })
})

router.get('/test', (req, res) => {
  console.log(req.cookies)
})

// AUTH
router.get('/user', auth, auth_controller.user)

// ACCOUNTS 
router.post('/accounts/login', account_controller.login)
router.post('/accounts/register', account_controller.register)
router.post('/accounts/edit', auth, account_controller.edit)
router.post('/accounts/edit/image', auth, account_controller.upload_image)
router.delete('/accounts/edit/image', auth, account_controller.delete_image)

// ARTICLES 
router.get('/feed', auth, article_controller.feed)
router.post('/articles', auth, article_controller.create)
router.get('/articles', auth, article_controller.article_list)
router.get('/articles/:id', auth, article_controller.article)
router.delete('/articles/:id', auth, article_controller.delete)
router.post('/articles/:id/favorite', auth, article_controller.favorite)
router.delete('/articles/:id/favorite', auth, article_controller.unfavorite)

// COMMENTS
router.get('/articles/:id/comments', auth, comment_controller.comment_list)
router.post('/articles/:id/comments', auth, comment_controller.create)
router.delete('/comments/:id', auth, comment_controller.delete)
router.post('/comments/:id/favorite', auth, comment_controller.favorite)
router.delete('/comments/:id/favorite', auth, comment_controller.unfavorite)

// SEARCH
router.get('/search', auth, search_controller.username);

// PROFILES
router.get('/profiles/:username', auth, profile_controller.profile)
router.get('/profiles/:username/articles', auth, profile_controller.timeline)
router.get('/profiles/:username/followers', auth, profile_controller.follower_list)
router.get('/profiles/:username/following', auth, profile_controller.following_list)
router.post('/profiles/:username/follow', auth, profile_controller.follow)
router.delete('/profiles/:username/follow', auth, profile_controller.unfollow)

module.exports = router;
