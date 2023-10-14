const listHelper = require('../utils/list_helper');

const listWithOnePost = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
];

const listWithMutliplePosts = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
];

test('dummy returns one', () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe('total likes', () => {
  test('when theres one post, returns number of likes of that post', () => {
    expect(listHelper.totalLikes(listWithOnePost)).toBe(5);
  });

  test('when there are many posts, returns total number of likes of those posts', () => {
    expect(listHelper.totalLikes(listWithMutliplePosts)).toBe(24);
  });

  test('return 0 if there are no posts', () => {
    expect(listHelper.totalLikes([])).toBe(0);
  });
});

describe('favorite blog', () => {
  test('when list has only one blog, return that', () => {
    expect(listHelper.favoriteBlog(listWithOnePost)).toEqual(
      listWithOnePost[0]
    );
  });

  test('when list is empty, returns null', () => {
    expect(listHelper.favoriteBlog([])).toEqual(null);
  });

  test('if list has multiple blods, return the one with the hightest amount of likes', () => {
    expect(listHelper.favoriteBlog(listWithMutliplePosts)).toEqual({
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0,
    });
  });
});
