import React, { useState, useEffect } from 'react';
import { withAuthenticator, AmplifySignOut  } from '@aws-amplify/ui-react';
import { listNotes } from './graphql/queries';
import { createNote } from './graphql/mutations';
import { API, graphqlOperation } from 'aws-amplify';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [submit, setSubmit] = useState(false);
  const [noteInput, setNoteInput] = useState("");

  useEffect(() => {
    async function getNotesFromAWS() {
      const result = await API.graphql(graphqlOperation(listNotes));
      setNotes(result.data.listNotes.items)
    }

    getNotesFromAWS();
  }, [submit]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setSubmit(true);

    const input = {
      note: noteInput
    };

    const result = await API.graphql(graphqlOperation(createNote, { input: input  }));
    setNoteInput("");
    setSubmit(false);
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
            <input type="text" className="pa2 f4" placeholder="Write a note" value={noteInput} onChange={(e) => setNoteInput(e.target.value)} /> 
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
