import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useState, useEffect } from 'react'
import { getPosts, createPost, createComment } from './api/api'

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
  const [content, setContent] = useState({
    name: '',
    content: ''
  })
  const [message, setMessage] = useState({})
  const [modal, setModal] = useState(false)

  useEffect(() => {
    getPosts().then(res => setPosts(Object.values(res)))
  })

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent({
      ...content,
      [e.target.name]: e.target.value
    })
  }

  const submitPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await createPost(
        content.name,
        content.content,
      ).then(() => {
        setContent({
          name: '',
          content: ''
        })
      }).then(() => {
        modalHandler()
      })
    } catch (error: any) {
      setMessage(error.message)
    }
  }

  const submitComment = async (e: React.FormEvent<HTMLFormElement>, id: number) => {
    e.preventDefault()
    try {
      await createComment(
        id,
        content.name,
        content.content,
      ).then(() => {
        setContent({
          name: '',
          content: ''
        })
      })
    } catch (error: any) {
      setMessage(error.message)
    }
  }

  const modalHandler = () => {
    setModal(!modal)
  }

  return (
    <main>
      {modal && 
      <div className='absolute bottom-0 left-0 w-screen h-screen bg-black/75 flex flex-column justify-center items-center'>
        <div className='bg-white relative'>
          <button
          onClick={modalHandler}
          className='absolute top-1 right-1 bg-black text-white p-1.5 rounded-xl hover:opacity-50'>X</button>
          <form
            onSubmit={submitPost}
            className='p-16 flex flex-col justify-center items-center'>
              <h2 className='text-2xl'>New post</h2>
              <input
              type="text"
              name='name'
              onChange={onInput}
              placeholder='Your name'
              required
              className='border-b-2 border-black m-4 outline-0 focus:scale-110' />
              <input
              type="text"
              name='content'
              onChange={onInput}
              placeholder='Post content'
              required
              className='border-b-2 border-black m-4 outline-0 focus:scale-110' />
              <button className='m-4 bg-black text-white p-1.5 rounded-xl hover:opacity-50'>Create post</button>
            </form>
        </div>
      </div>
      }
      <header className='w-screen flex flex-row items-center justify-between pt-4 pb-4 pr-8 pl-8 text-white bg-black'>
        <h1>PHP Blog</h1>
        <button
        onClick={modalHandler}
        className='bg-white text-black p-1.5 rounded-xl hover:opacity-50'>New post</button>
      </header>
      {posts.map((post, i) => {
        return(
          <div
          key={i}
          className='m-8 p-8 rounded-xl border shadow-xl'>
            <p>Author: {post.post_user}</p>
            <p>{post.post}</p>
            {post.comments.map((comment, j) => {
              return(
                <div
                key={j}
                className='ml-16'>
                  <p>{comment.comment_user}:</p>
                  <p>--{comment.comment}</p>
                </div>
              )
            })}
            <form
            onSubmit={(e) => submitComment(e, post.post_id)}
            className='flex flex-col justify-center items-center'>
              <input
              type="text"
              name='name'
              onChange={onInput}
              placeholder='Your name'
              required
              className='border-b-2 border-black m-4 outline-0 focus:scale-110' />
              <input
              type="text"
              name='content'
              onChange={onInput}
              placeholder='Your comment'
              required
              className='border-b-2 border-black m-4 outline-0 focus:scale-110' />
              <button className='m-4 bg-black text-white p-1.5 rounded-xl hover:opacity-50'>Create comment</button>
            </form>
          </div>
        )
      })}
    </main>
  )
}
