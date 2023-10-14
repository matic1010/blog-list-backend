const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

describe('fetching all notes', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });
});

describe('viewing a specific note', () => {
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb();

    const blogToView = blogsAtStart[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(resultBlog.body).toEqual(blogToView);
  });

  test('unique identifier is called "id", not "_id"', async () => {
    const blogs = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(blogs.body[0].id.toBeDefined);
    expect(blogs.body[0]['_id']?.not.toBeDefined);
  });
});

describe('addition of new blog', () => {
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

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1);
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

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1);
    expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0);
  });

  test('if title or url property is missing in POST request, return status 400', async () => {
    const titleMissing = {
      author: 'Nils Matic',
      url: 'www.google.com',
      likes: 4,
    };

    const urlMissing = {
      title: 'The url is missing from this blog',
      author: 'Nils Matic',
      likes: 8,
    };

    await api.post('/api/blogs').send(titleMissing).expect(400);

    await api.post('/api/blogs').send(urlMissing).expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length);
  });
});

describe('deletion of a note', () => {
  test('succeeds with status of 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogsAtEnd.map((b) => b.title);

    expect(titles).not.toContain(blogToDelete.title);
  });
});

describe('updating a note', () => {
  test('increasing likes on a blog works', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = { ...blogsAtStart[0], likes: 0 };

    await api.put(`/api/blogs/${blogToUpdate.id}`).send(blogToUpdate);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd[0].likes).toBe(0);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
