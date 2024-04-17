import React from 'react'
import { getCurrentUser } from './firebase/firebase-admin';
import Home from './components/Home';

export default async function page() {
  const currentUser = await getCurrentUser();
  
  // if user exists, show Home component
  if (!currentUser) return (
    <div className="not-signedin">
      <p>Please signin with google account.<br/>
      No personal data is saved, Google handles authentication.
      </p>
    </div>
  ) 
  
  if (currentUser) return (
    <Home currentUser={JSON.parse(JSON.stringify(currentUser))}/>
  )
}
