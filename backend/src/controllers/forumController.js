const ForumTopic = require('../models/ForumTopic');
const ForumPost = require('../models/ForumPost');
const Notification = require('../models/Notification');

exports.createTopic = async (req, res, next) => {
  try {
    const topic = await ForumTopic.create({
      ...req.body,
      author: req.user._id,
    });
    res.status(201).json({ message: 'Topic created', topic });
  } catch (error) {
    next(error);
  }
};

exports.getTopicsByCourse = async (req, res, next) => {
  try {
    const topics = await ForumTopic.find({ course: req.params.courseId })
      .populate('author', 'firstName lastName avatar')
      .sort({ isPinned: -1, createdAt: -1 });

    res.json({ topics });
  } catch (error) {
    next(error);
  }
};

exports.getTopicById = async (req, res, next) => {
  try {
    const topic = await ForumTopic.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'firstName lastName avatar');

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    const posts = await ForumPost.find({ topic: topic._id })
      .populate('author', 'firstName lastName avatar')
      .sort({ createdAt: 1 });

    res.json({ topic, posts });
  } catch (error) {
    next(error);
  }
};

exports.updateTopic = async (req, res, next) => {
  try {
    const topic = await ForumTopic.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    res.json({ message: 'Topic updated', topic });
  } catch (error) {
    next(error);
  }
};

exports.deleteTopic = async (req, res, next) => {
  try {
    const topic = await ForumTopic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    await ForumPost.deleteMany({ topic: topic._id });
    await ForumTopic.findByIdAndDelete(req.params.id);

    res.json({ message: 'Topic deleted' });
  } catch (error) {
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const post = await ForumPost.create({
      ...req.body,
      author: req.user._id,
    });

    await ForumTopic.findByIdAndUpdate(req.body.topic, {
      $inc: { postCount: 1 },
    });

    const topic = await ForumTopic.findById(req.body.topic);
    if (topic && topic.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: topic.author,
        type: 'new_forum_post',
        title: 'New Forum Reply',
        message: `New reply in topic "${topic.title}"`,
        link: `/forum.html?topic=${topic._id}`,
      });
    }

    res.status(201).json({ message: 'Post created', post });
  } catch (error) {
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const post = await ForumPost.findByIdAndUpdate(
      req.params.postId,
      { content: req.body.content, isEdited: true },
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ message: 'Post updated', post });
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await ForumPost.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await ForumTopic.findByIdAndUpdate(post.topic, {
      $inc: { postCount: -1 },
    });

    await ForumPost.findByIdAndDelete(req.params.postId);

    res.json({ message: 'Post deleted' });
  } catch (error) {
    next(error);
  }
};
