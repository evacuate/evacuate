import env from '~/env';

export const getHashtags = () => {
  const tags = env.HASHTAGS?.split(',').map((tag) => `#${tag.trim()}`);
  return tags?.length ? tags : ['#evacuate'];
};
