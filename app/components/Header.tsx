'use client'

import React from 'react'
import { signInWithGoogle, signOut } from '../firebase/auth';
import { useRouter } from 'next/navigation';
import { UserRecord } from 'firebase-admin/auth';

export default function Header({ userData } : { userData: UserRecord | null }) {

  const router = useRouter();

  const signIn = async () => {
    const success = await signInWithGoogle();
    if (success) {
      router.push('/home');
      router.refresh();
    }
  }

  const handleSignOut = async () => {
    const success = await signOut();
    if (success) {
      router.push('/');
      router.refresh();
    }
  }
  
  return (
    <header className='navbar'>
      <div className='nav-wrap'>
        <h1>Calendar Manager</h1>
        <div className='user-wrap'>
          {
            userData ? <div className='profile'>
              <span>{userData.email}</span>
              <img src={userData.photoURL} alt='profile picture' />
            </div>
            : <></>
          }
          {
            !userData ? <button onClick={() => signIn()} className='btn-primary'>Sign In</button>
            : <button onClick={() => handleSignOut()} className='btn-primary'>Sign Out</button>
          }
        </div>
      </div>
    </header>
  )
}
