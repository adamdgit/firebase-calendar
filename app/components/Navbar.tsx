'use client'

import React, { useEffect, useState } from 'react'
import { auth, provider } from '@/app/lib/config'
import { User, getRedirectResult, onAuthStateChanged, signInWithRedirect, signOut } from 'firebase/auth';

export default function Navbar() {
  
  const [userData, setUserData] = useState<User | null>();

  // upon redirect from firebase auth flow, check user credentials
  // if they exist, set a cookie via /api/login and store in useState
  useEffect(() => {
    onAuthStateChanged(auth, async (userCred) => {
      if (userCred) {
        setUserData(auth.currentUser);
        console.log(auth.currentUser);
      } else {
        return;
      }
    })

    getRedirectResult(auth).then(async (userCred) => {
      if (!userCred) {
        return;
      }

      fetch("/api/login", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await userCred.user.getIdToken()}`,
        },
      }).then((response) => {
        if (response.status === 200) {
          setUserData(auth.currentUser);
          console.log(auth.currentUser);
        }
      });
    });
  },[])

  async function signOutUser() {
    await signOut(auth);

    const response = await fetch("/api/signout", {
      method: "POST",
    });

    // reload page for logout visual feedback to user
    if (response.status === 200) {
      window.location.reload();
    }
  }

  async function signInUser() {
    signInWithRedirect(auth, provider)
  }

  return (
    <nav className='navbar'>
      <div className='nav-wrap'>
        <h1>Calendar Manager</h1>
        <div className='user-wrap'>
          {userData ? 
          <div className='profile'>
            <span>{userData.email}</span>
            <img src={userData.photoURL} alt='profile picture' />
          </div>
          : <></>}
          <ul>
            {
              userData ? 
              <li><button className='btn-primary' onClick={() => signOutUser()}>Sign Out</button></li> :
              <li><button className='btn-primary' onClick={() => signInUser()}>Sign In</button></li>
            }
          </ul>
        </div>
      </div>
    </nav>
  )
}
