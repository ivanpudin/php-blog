import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useState, useEffect } from 'react'
import { getPosts } from './api/api'

interface Post {
  post_user: string
  post: string
  comments: Comment[]
}

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    getPosts().then(res => setPosts(Object.values(res)))
  })

  return (
    <main>
      <header className='w-screen flex flex-row items-center justify-start pt-4 pb-4 pr-4 pl-8 text-white bg-black'><h1>PHP Blog</h1></header>
    </main>
  )
}
