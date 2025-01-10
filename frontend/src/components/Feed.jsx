import React from 'react'
import Posts from './Posts'
import StoriesContainer from './StoriesContainer' 

const Feed = () => {
  return (
    <div className='flex-1 my-8 flex flex-col items-center pl-[20%]'>
        <StoriesContainer /> 
        <Posts/>
    </div>
  )
}

export default Feed