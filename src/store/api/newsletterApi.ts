'use client';

import { apiSlice } from './apiSlice';

const newsletterApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    subscribeNewsletter: builder.mutation<{ success: boolean; message: string }, { email: string }>({
      query: (body) => ({
        url: '/newsletter/subscribe',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useSubscribeNewsletterMutation } = newsletterApi;
