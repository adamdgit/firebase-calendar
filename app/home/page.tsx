import React from 'react'
import { getCurrentUser } from '../firebase/firebase-admin';
import Home from '../components/Home';

export default async function page() {

  const currentUser = await getCurrentUser();
  
  return (
      <Home currentUser={JSON.parse(JSON.stringify(currentUser))}/>
  )
}
