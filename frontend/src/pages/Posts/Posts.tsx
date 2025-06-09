import { useEffect, useState } from 'react';
import { Box, List, ListItem, Typography } from '@mui/material';
import { getPosts } from '../../api/posts';
import { Post } from '../../types/post';

export const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Посты</Typography>
      <List>
        {posts.map(post => (
          <ListItem key={post.id}>
            <Typography>{post.title}</Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};