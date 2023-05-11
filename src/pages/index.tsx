import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useState, useEffect } from 'react'
import { getPosts, createComment } from './api/api'

interface Post {
  post_id: number
  post_user: string
  post: string
  comments: Comment[]
}

interface Comment {
  comment_user: string
  comment: string
}

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [comment, setComment] = useState({
    name: '',
    comment: ''
  })
  const [message, setMessage] = useState({})

  useEffect(() => {
    getPosts().then(res => setPosts(Object.values(res)))
  })

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment({
      ...comment,
      [e.target.name]: e.target.value
    })
  }

  const submitComment = async (e: React.FormEvent<HTMLFormElement>, id: number) => {
    e.preventDefault()
    try {
      await createComment(
        id,
        comment.name,
        comment.comment,
      ).then(() => setComment({
        name: '',
        comment: ''
    }))
    } catch (error: any) {
      setMessage(error.message)
    }
  }

  return (
    <main>
      <header className='w-screen flex flex-row items-center justify-start pt-4 pb-4 pr-4 pl-8 text-white bg-black'><h1>PHP Blog</h1></header>
      {posts.map((post, i) => {
        return(
          <div key={i} className='m-8'>
            <p>Author: {post.post_user}</p>
            <p>{post.post}</p>
            {post.comments.map((comment, j) => {
              return(
                <div key={j} className='ml-16'>
                  <p>{comment.comment_user}:</p>
                  <p>--{comment.comment}</p>
                </div>
              )
            })}
            <form onSubmit={(e) => submitComment(e, post.post_id)} className='flex flex-col justify-center items-center'>
              <input type="text" name='name' onChange={onChangeInput} placeholder='Your name' required />
              <input type="text" name='comment' onChange={onChangeInput}  placeholder='Your comment' required />
              <button>Post comment</button>
            </form>
          </div>
        )
      })}
    </main>
  )
}
