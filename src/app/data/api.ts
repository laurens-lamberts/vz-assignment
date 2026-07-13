import { create } from 'axios';

const api = create({
  baseURL: 'https://favqs.com/api',
  headers: {
    Authorization: `Token token="${process.env.EXPO_PUBLIC_FAVQS_API_TOKEN}"`,
  },
});

export { api };
