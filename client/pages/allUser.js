import React,{useState, useEffect, useContext} from 'react'

// Internal imports
import { UserCard } from '../components'
import Style from "../styles/allUser.module.css"
import { ChatAppContext } from '../Context/ChatAppContext'

const allUser = () => {
    const {userList, addFriends} = useContext(ChatAppContext)


  return (
    <div>
        <div className={Style.alluser_info}>
            <h1>Find Your Friends</h1>
        </div>
        <div className={Style.alluser}>
            {userList.map((el,i) => (
                <UserCard key={i+1} addFriends = {addFriends}/>
            ))}

        </div>
    </div>
  )
}

export default allUser