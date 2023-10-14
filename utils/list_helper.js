const dummy = (blogs) => {
  return 1;
};

const totalLikes = (posts) => {
  const total = posts.reduce((sum, current) => {
    return sum + current.likes;
  }, 0);

  return total;
};

const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce((fav, current) => {
    return fav && fav.likes > current.likes ? fav : current;
  }, null);
  return favorite;
};

module.exports = { dummy, totalLikes, favoriteBlog };
