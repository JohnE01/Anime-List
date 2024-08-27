import React, { useContext } from 'react';
import { BlogContext } from '../../context/BlogContext';
import PostItem from './PostItem';

const PostList = () => {
  const { posts } = useContext(BlogContext);

  return (
    <div>
      <h2>Posts</h2>
      {posts.map((post, index) => (
        <PostItem key={index} post={post} />
      ))}
    </div>
  );
};

export default PostList;
