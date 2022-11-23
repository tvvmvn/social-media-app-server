// Profile
useEffect(() => {
  fetch(`http://localhost:3000/profiles/${params.username}`)
  .then(res => res.json())
  .then(result => {
    fetchFollow(result)
  })
  .catch(err => {
    setIsLoaded(true)
    setError(err)
  })

  function fetchFollow(profileData) {
    fetch(`http://localhost:3000/profiles/${params.username}/follow`, {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    })
    .then(res => res.json())
    .then(result => {
      fetchArticles(profileData, result)
    })
  }

  function fetchArticles(profileData, followData) {
    fetch(`http://localhost:3000/articles?username=${params.username}`)
    .then(res => res.json())
    .then(result => {
      setIsLoaded(true)
      setProfile(profileData)
      setFollow(followData)
      setArticles(result)
    })
  }
}, [])

function Profile() {
  console.log('Profile Loaded!');

  const auth = useContext(AuthContext);
  const params = useParams();
  const username = params.username;
  const isMaster = auth.user.username === username ? true : false;
  const [error, setError] = useState(null);

  function ProfileTemplate() {
    console.log('ProfileTemplate Loaded!');

    const [profile, setProfile] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
      fetch(`http://localhost:3000/profiles/${username}`)
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        throw res;
      })
      .then(result => {
        setProfile(result.profile);
      })
      .catch(err => {
        setError(err)
      })
      .finally(() => setIsLoaded(true))
    }, [])

    if (!isLoaded) {
      return <h1>Loading...</h1>
    }
    return (
      <>
        <h3>{profile.username}</h3>
        <div>
          <img src={`http://localhost:3000/user/${profile.image || 'avatar.jpeg'}`} />
          <div>
            <p>{profile.bio}</p>
          </div>
          {isMaster && 
            <div><Link to={`/profiles/${username}/edit`}>Edit Profile</Link></div> 
          }
        </div>
      </>
    )
  }

  function FollowTemplate() {
    console.log('FollowTemplate Loaded!');

    const [follow, setFollow] = useState(null);
    const [updateFollow, setUpdateFollow] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [done, setDone] = useState(true);

    function handleFollow(following) {
      setIsLoaded(false);

      fetch(`http://localhost:3000/profiles/${username}/follow`, {
        method: following? 'POST' : 'DELETE',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
      })
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        throw res;
      })
      .then(result => {
        console.log(result)
      })
      .catch(err => {
        setError(err)
      })
      .finally(() => setUpdateFollow(following))
    }

    // Follow
    useEffect(() => {
      fetch(`http://localhost:3000/profiles/${username}/follow`, {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
      })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then(result => {
        setFollow(result)
      })
      .catch(err => {
        setError(err)
      })
      .finally(() => setIsLoaded(true))
    }, [updateFollow])

    if (!isLoaded) {
      return <h1>Loading...</h1>
    }
    return (
      <div>
        <h3>Follow</h3>
        <ul>
          <li>Follower: <Link to={`/profiles/${username}/follower`}>{follow.followerList.length}</Link></li>
          <li>Following: <Link to={`/profiles/${username}/following`}>{follow.followingList.length}</Link></li>

          {!isMaster &&
          <li>
            { follow.isFollowing ?
              <button onClick={() => handleFollow(false)}>Unfollow</button>
              : 
              <button onClick={() => handleFollow(true)}>Follow</button>
             } 
          </li>
          }
        </ul>
      </div>
    )
  }

  function ArticlesTemplate() {
    console.log('ArticlesTemplate Loaded!');

    const [articles, setArticles] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [skip, setSkip] = useState(0);
    const [done, setDone] = useState(false)

    // Articles
    useEffect(() => {
      setDone(false);

      fetch(`http://localhost:3000/articles/?username=${username}&limit=3&skip=${skip}`)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then(moreArticles => {
        setArticles([...articles, ...moreArticles])
      })
      .catch(err => {
        setError(err)
      })
      .finally(() => {
        setIsLoaded(true)
        setDone(true)
      })
    }, [skip])

    if (!isLoaded) {
      return <h1>Loading...</h1>
    }
    return (
      <div>
        <h3>Posts</h3>
        {articles.map(article =>
          <Link to={`/p/${article._id}`} key={article._id}>
            <img src={"http://localhost:3000/posts/" + article.photos[0] } />
          </Link> 
        )}
        {done ? <button onClick={() => setSkip(skip + 3)}>More</button>
          :
          <h1>Loading...</h1>
        }
      </div>
    )
  }

  if (error) {
    return <h1>Error!</h1>
  } 
  return (
    <div>
      <h1>Profile</h1>
      <ProfileTemplate />
      <FollowTemplate />
      <ArticlesTemplate />
    </div>
  )
}

function Profile() {
  const auth = useContext(AuthContext);
  const params = useParams();
  const username = params.username;
  const isMaster = auth.user.username === username ? true : false;
  const [error, setError] = useState(null);

  const [profile, setProfile] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [follow, setFollow] = useState(null);
  const [updateFollow, setUpdateFollow] = useState(null);
  const [done, setDone] = useState(true);

  const [articles, setArticles] = useState([]);
  const [skip, setSkip] = useState(0);

  // Profile
  useEffect(() => {
    fetch(`http://localhost:3000/profiles/${username}`)
    .then(res => {
      if (res.ok) {
        return res.json()
      }
      throw res;
    })
    .then(result => {
      setProfile(result.profile);
    })
    .catch(err => {
      setError(err)
    })
    .finally(() => setIsLoaded(true))
  }, [])

  // Follow
  useEffect(() => {
    fetch(`http://localhost:3000/profiles/${username}/follow`, {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      throw res;
    })
    .then(result => {
      setFollow(result)
    })
    .catch(err => {
      setError(err)
    })
    .finally(() => setIsLoaded(true))
  }, [updateFollow])

  function handleFollow(following) {
    setIsLoaded(false);

    fetch(`http://localhost:3000/profiles/${username}/follow`, {
      method: following? 'POST' : 'DELETE',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    })
    .then(res => {
      if (res.ok) {
        return res.json()
      }
      throw res;
    })
    .then(result => {
      console.log(result)
    })
    .catch(err => {
      setError(err)
    })
    .finally(() => setUpdateFollow(following))
  }

  // Articles
  useEffect(() => {
    setDone(false);

    fetch(`http://localhost:3000/articles/?username=${username}&limit=3&skip=${skip}`)
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      throw res;
    })
    .then(moreArticles => {
      setArticles([...articles, ...moreArticles])
    })
    .catch(err => {
      setError(err)
    })
    .finally(() => {
      setIsLoaded(true)
      setDone(true)
    })
  }, [skip])

  if (error) {
    return <h1>Error!</h1>
  }
  if (!isLoaded) {
    return <h1>Loading...</h1>
  }
  return (
    <>
      <h3>{profile.username}</h3>
      <div>
        <img src={`http://localhost:3000/user/${profile.image || 'avatar.jpeg'}`} />
        <div>
          <p>{profile.bio}</p>
        </div>
        {isMaster && 
          <div><Link to={`/profiles/${username}/edit`}>Edit Profile</Link></div> 
        }
      </div>
      <div>
        <h3>Follow</h3>
        <ul>
          <li>Follower: <Link to={`/profiles/${username}/follower`}>{follow.followerList.length}</Link></li>
          <li>Following: <Link to={`/profiles/${username}/following`}>{follow.followingList.length}</Link></li>

          {!isMaster &&
          <li>
            { follow.isFollowing ?
              <button onClick={() => handleFollow(false)}>Unfollow</button>
              : 
              <button onClick={() => handleFollow(true)}>Follow</button>
             } 
          </li>
          }
        </ul>
      </div>
      <div>
        <h3>Posts</h3>
        {articles.map(article =>
          <Link to={`/p/${article._id}`} key={article._id}>
            <img src={"http://localhost:3000/posts/" + article.photos[0] } />
          </Link> 
        )}
        {done ? <button onClick={() => setSkip(skip + 3)}>More</button>
          :
          <h1>Loading...</h1>
        }
      </div>
    </>
  )
}

function Profile() {
  console.log('>>> Profile Loaded!');

  const auth = useContext(AuthContext);
  const params = useParams();
  const username = params.username;
  const isMaster = auth.user.username === username ? true : false;
  const [x, setX] = useState(null);

  const results = [
    useFetch(`http://localhost:3000/profiles/${username}`),
    useFetch(`http://localhost:3000/profiles/${username}/follow`, {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
    }),
    useFetch(`http://localhost:3000/articles?username=${username}`)
  ];

  const profile = results[0].data?.profile
  const follow = results[1].data
  const articles = results[2].data

  // function handleFollow(following) {
  //   fetch(`http://localhost:3000/profiles/${username}/follow`, {
  //     method: following? 'POST' : 'DELETE',
  //     headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
  //   })
  //   .then(res => {
  //     if (res.ok) {
  //       return res.json()
  //     }
  //     throw res;
  //   })
  //   .then(result => {
  //     // console.log(result)
  //     setX(1)
  //   })
  //   .catch(error => {
  //     // setError(err)
  //     console.error(error)
  //   })
  // }

  useFetch(`http://localhost:3000/profiles/${username}/follow`, {
    method: following? 'POST' : 'DELETE',
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
  })

  for (let result of results) {
    if (result.error) {
      return <h1>Error!</h1>
    }
    if (!result.isLoaded) {
      return <h1>Loading...</h1>
    } 
  }

  return (
    <>
      <h3>{profile.username}</h3>
      <div>
        <img src={`http://localhost:3000/user/${profile.image || 'avatar.jpeg'}`} />
        <div>
          <p>{profile.bio}</p>
        </div>
        {isMaster && 
          <div><Link to={`/profiles/${username}/edit`}>Edit Profile</Link></div> 
        }
      </div>
      <div>
        <h3>Follow</h3>
        <ul>
          <li>Follower: <Link to={`/profiles/${username}/follower`}>{follow.followerList.length}</Link></li>
          <li>Following: <Link to={`/profiles/${username}/following`}>{follow.followingList.length}</Link></li>

          {!isMaster &&
          <li>
            { follow.isFollowing ?
              <button onClick={() => handleFollow(false)}>Unfollow</button>
              : 
              <button onClick={() => handleFollow(true)}>Follow</button>
             } 
          </li>
          }
        </ul>
      </div>
      <div>
        <h3>Posts</h3>
        {articles.map(article =>
          <Link to={`/p/${article._id}`} key={article._id}>
            <img src={"http://localhost:3000/posts/" + article.photos[0] } />
          </Link> 
        )}
      </div>
    </>
  )
}