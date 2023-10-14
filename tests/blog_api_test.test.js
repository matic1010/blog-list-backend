const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

const initialBlogs = [
  [
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
  ],
];

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(initialBlogs.length);
});

test('unique identifier is called "id", not "_id"', async () => {
  const blogs = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(blogs.body[0].id.toBeDefined);
  expect(blogs.body[0]['_id']?.not.toBeDefined);
});

test('new blog gets posted successfully', async () => {
  const blogToAdd = {
    title: 'This is a blog to be added',
    author: 'Nils Matic',
    url: 'www.google.com',
    likes: 0,
  };

  await api
    .post('/api/blogs')
    .send(blogToAdd)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await Blog.find({});

  expect(blogsAtEnd.length).toBe(initialBlogs.length + 1);
  const titles = blogsAtEnd.map((b) => b.title);
  expect(titles).toContain(blogToAdd.title);
});

test('if likes property is missing gets dafaulted to 0', async () => {
  const blogToAdd = {
    title: 'This is a blog to be added',
    author: 'Nils Matic',
    url: 'www.google.com',
  };

  await api
    .post('/api/blogs')
    .send(blogToAdd)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await Blog.find({});

  expect(blogsAtEnd.length).toBe(initialBlogs.length + 1);
  expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0);
});

afterAll(async () => {
  await mongoose.connection.close();
});
