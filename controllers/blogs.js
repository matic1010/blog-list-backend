const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);
  if (!blog.likes) blog.likes = 0;
  try {
    if (!blog.title || !blog.url) throw new Error('Bad Request');
    const result = await blog.save();
    response.status(201).json(result);
  } catch (error) {
    response.status(400).end();
  }
});

blogsRouter.put('/:id', async (request, response) => {
  try {
    const body = request.body;

    const blogToUpdate = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
    };

    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      blogToUpdate,
      {
        new: true,
      }
    );
    response.json(updatedBlog);
  } catch (error) {
    console.error(error);
    response.status(400).end();
  }
});

blogsRouter.delete(`/:id`, async (request, response) => {
  try {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (error) {
    response.status(400).end();
  }
});

module.exports = blogsRouter;
