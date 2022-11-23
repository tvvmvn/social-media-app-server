const {User, Article, Follow} = require("./models/model");
const crypto = require("crypto")
const fs = require("fs");

async function createUser(username, email, password = "123") {
  const salt = crypto.randomBytes(16).toString("hex");
  const hashedPassword = crypto.pbkdf2Sync(password, salt, 310000, 32, "sha256")
  .toString("hex")
  
  const files = fs.readdirSync(`${__dirname}/seeds/profiles`)
  const file = files.find(file => file.startsWith(username));
  const newFile = `${crypto.randomBytes(24).toString("hex")}.${file.split(".")[1]}`;
  
  const oldPath = `${__dirname}/seeds/profiles/${file}`;
  const newPath = `${__dirname}/data/users/${newFile}`;

  fs.copyFileSync(oldPath, newPath);

  const user = new User({
    username,
    email,
    password: hashedPassword,
    salt,
    bio: `I'm ${username}`,
    photo: newFile
  })
  await user.save();

  return 0;
}

async function createArticle(username, postId) {
  const user = await User.findOne({username});

  const files = fs.readdirSync(`${__dirname}/seeds/${username}/`);
  const fileList = files.filter(file => file.startsWith(username + postId));

  const newFiles = fileList.map(file => {
    const newFile = `${crypto.randomBytes(24).toString("hex")}.${file.split(".")[1]}`;
    
    const oldPath = `${__dirname}/seeds/${username}/${file}`;
    const newPath = `${__dirname}/data/articles/${newFile}`;
    fs.copyFileSync(oldPath, newPath);

    return newFile;
  })

  const article = new Article({
    description: `${username}'s photo!`,
    photos: newFiles,
    user: user._id,
    created: Date.now()
  })
  await article.save();

  return 0;
}

async function createFollowing(follower, following) {
  const _follower = await User.findOne({username: follower});
  const _following = await User.findOne({username: following});

  const follow = new Follow({
    follower: _follower._id,
    following: _following._id
  })

  await follow.save();

  return 0;
}

async function plantSeeds() {
  try {
    await createUser("bunny", "bunny@example.com");
    await createUser("cat", "cat@example.com");
    await createUser("bird", "bird@example.com");
    await createUser("duck", "duck@example.com");
  
    await createUser("dog", "dog@example.com");
    await createUser("pug", "pug@example.com");
    await createUser("quokka", "quokka@example.com");
    await createUser("monkey", "monkey@example.com");
  
    await createFollowing("pug", "bunny");
    await createFollowing("bunny", "cat");
    await createFollowing("bunny", "quokka");
    await createFollowing("bunny", "dog");

    await createArticle("bunny", "1")
    await createArticle("bunny", "2")
    await createArticle("bunny", "3")

    await createArticle("cat", "1")
    await createArticle("cat", "2")
    await createArticle("cat", "3")
    await createArticle("cat", "4")

    await createArticle("bird", "1")

    await createArticle("duck", "1")
    await createArticle("duck", "2")
    await createArticle("duck", "3")

    await createArticle("dog", "1")
    await createArticle("dog", "2")
    await createArticle("dog", "3")
    await createArticle("dog", "4")

    await createArticle("pug", "1")
    await createArticle("pug", "2")
    await createArticle("pug", "3")

    await createArticle("quokka", "1")
    await createArticle("quokka", "2")
    await createArticle("quokka", "3")

    await createArticle("monkey", "1")
    await createArticle("monkey", "2")
    await createArticle("monkey", "3")
  
    console.log(".");

  } catch (error) {
    console.error(error)
  }
}

// plantSeeds();