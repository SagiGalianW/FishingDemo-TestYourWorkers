import React from 'react'

const UserCard = (props) => {
  return (
    <div className='flex'>
        {/* <h1 className='m-2 w-1/5'>{props.id}</h1> */}
        <h1 className='m-2 w-1/4'>{props.firstName}</h1>
        <h1 className='m-2 w-1/4'>{props.lastName}</h1>
        <h1 className='m-2 w-1/4'>{props.email}</h1>
        <h1 className='m-2 w-1/4'>{props.phone}</h1>
    </div>
  )
}

export default UserCard