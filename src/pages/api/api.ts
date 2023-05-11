// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const URL = 'http://localhost:1005/api.php'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const posts = await getPosts();
    res.status(200).json(posts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const getPosts = async () => {
  let url = URL + '?action=posts'
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })

  if (response.status === 204) {
    return []
  } else if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch posts')
  } else if (response.status === 200) {
    return await response.json()
  }
}

export const createComment = async (referencePostId: number, user: string, comment: string) => {
  const action = 'create-comment'
  const response = await fetch(`${URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ referencePostId, user, comment, action })
  })

  if (response.status === 500) {
    throw new Error('Unable to post comment')
  } else if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch comments')
  }

  return await response.json()
}
