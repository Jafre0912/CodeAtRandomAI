import axios from 'axios';


const API_BASE_URL = 'https://codeatrandomai.onrender.com/api';

const HN_TOP_STORIES = 'https://hacker-news.firebaseio.com/v0/topstories.json';
const HN_ITEM_URL = 'https://hacker-news.firebaseio.com/v0/item/';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const analyzeSkills = async (role, skills) => {
  const skillsArray = typeof skills === 'string' ? skills.split(',') : skills;
  return await api.post('/skill-gap', { role, skills: skillsArray });
};

export const getRoadmap = async (role) => {
  return await api.post('/roadmap', { role });
};

export const fetchTopStories = async () => {
  try {
    const { data: ids } = await axios.get(HN_TOP_STORIES);
    const top6Ids = ids.slice(0, 6);

    const storyPromises = top6Ids.map(id =>
      axios.get(`${HN_ITEM_URL}${id}.json`)
    );

    const storiesResponses = await Promise.all(storyPromises);
    return storiesResponses.map(res => res.data);
  } catch (error) {
    console.error("HackerNews API Error:", error);
    return [];
  }
};
