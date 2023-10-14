const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: 'This is blog number 1',
    author: 'Nils Matic',
    url: 'www.test.example.com',
    likes: 23,
  },
  {
    title: 'This is blog number 2',
    author: 'Nils Matic',
    url: 'www.example.com',
    likes: 10,
  },
  {
    title: 'This is blog number 3',
    author: 'Timo Matic',
    url: 'www.example.com',
    likes: 7,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
};
