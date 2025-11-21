import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
const HN_TOP_STORIES = 'https://hacker-news.firebaseio.com/v0/topstories.json';
const HN_ITEM_URL = 'https://hacker-news.firebaseio.com/v0/item/';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// --- Backend API Calls ---

export const analyzeSkills = async (role, skills) => {
  // Convert string input to array if necessary
  const skillsArray = typeof skills === 'string' ? skills.split(',') : skills;
  return await api.post('/skill-gap', { role, skills: skillsArray });
};

export const getRoadmap = async (role) => {
  return await api.post('/roadmap', { role });
};

// --- HackerNews API Calls ---

export const fetchTopStories = async () => {
  try {
    // 1. Get Top Story IDs
    const { data: ids } = await axios.get(HN_TOP_STORIES);
    const top6Ids = ids.slice(0, 6); // Fetch 6 to fit grid layout

    // 2. Fetch details for each story
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