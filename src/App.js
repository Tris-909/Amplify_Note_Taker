import React, { useState, useEffect } from 'react';
import { withAuthenticator, AmplifySignOut  } from '@aws-amplify/ui-react';

const App = () => {
  const [notes, setNotes] = useState([{
    id: 1,
    note: 'Test'
  }]);

  const onSubmitHandler = () => {

  }

  return (
    <>
      <AmplifySignOut />
      <div 
        className="
          flex 
          flex-column 
          items-center 
          justify-center 
          pa3 
          bg-washed-red
        ">
          <h1 className="code f2-1">
            Amplify Note Taker
          </h1>
          <form className="mb3" onSubmit={onSubmitHandler}>
            <input type="text" className="pa2 f4" placeholder="Write a note" /> 
            <button type="submit">Add Note</button>
          </form>
          <div>
            {notes.map((note) => {
              return(
                <div className="flex items-center" key={note.id}>
                  <li className="list pa3 f3">
                    { note.note }
                    <button className="bg-transparent bn f4">
                      <span>&times;</span>
                    </button>
                  </li> 
                </div>
              )
            })}
          </div>
      </div>
    </>
  );
}

export default withAuthenticator(App);
