import React, { useState, useEffect } from 'react';
import { withAuthenticator, AmplifySignOut  } from '@aws-amplify/ui-react';
import { listNotes } from './graphql/queries';
import { createNote, deleteNote, updateNote } from './graphql/mutations';
import { API, graphqlOperation } from 'aws-amplify';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [update, setUpdate] = useState(false);
  const [noteUpdateID, setNoteUpdateID] = useState("");
  const [editNoteInput, setEditNoteInput] = useState("");
  const [noteInput, setNoteInput] = useState("");

  useEffect(() => {
    async function getNotesFromAWS() {
      const result = await API.graphql(graphqlOperation(listNotes));
      setNotes(result.data.listNotes.items)
    }

    getNotesFromAWS();
  }, [update]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setUpdate(true);

    const input = {
      note: noteInput
    };

    await API.graphql(graphqlOperation(createNote, { input: input  }));
    setNoteInput("");
    setUpdate(false);
  }

  const deleteNoteHandler = async (noteId) => {
    setUpdate(true);
    await API.graphql(graphqlOperation(deleteNote, { input: { id: noteId } }));
    setUpdate(false);
  }

  const editNoteHandler = async (editNoteId, noteContent) => {
    setNoteUpdateID(editNoteId);
    setEditNoteInput(noteContent);
  }

  const submitEditNote = async () => {
    setUpdate(true);

    const input = {
      id: noteUpdateID,
      note: editNoteInput
    }

    await API.graphql(graphqlOperation(updateNote, {
      input: input
    }));

    setNoteUpdateID("");
    setEditNoteInput("");
    setUpdate(false);
  }

  return (
    <>
      <AmplifySignOut />

      <Grid container spacing={3}>
        <Grid container item xs={6} justify="center">
          <form onSubmit={onSubmitHandler} style={{
            border: '2px solid black',
            padding: '1rem',
            height: '200px',
            marginTop: '2rem'
          }}>
            <Grid container justify="center" direction="column">
            <TextField id="standard-basic" label="Add Note" value={noteInput} onChange={(e) => setNoteInput(e.target.value)} />
            <Button 
              variant="contained"
              color="primary"
              type="submit"
              style={{
                marginTop: '2rem'
              }}> 
                Add Note 
            </Button>
            </Grid>
          </form>
        </Grid>

        <Grid item xs={4} container justify="center" direction="column">
          {notes.map((note) => {
              return(
                <Card variant="outlined" key={note.id} style={{marginTop: '2rem', display: 'flex', flexDirection: 'row'}}>
                  <CardContent>
                    {
                      noteUpdateID === note.id ? (
                        <TextField id="standard-basic" value={editNoteInput} onChange={(e) => setEditNoteInput(e.target.value)} /> 
                      ) : (
                        <Typography variant="h5" component="h2">
                          {note.note}
                        </Typography>
                      )
                    }
                  </CardContent>
                  <CardActions>
                      <Button size="small" onClick={() => deleteNoteHandler(note.id)}> Delete </Button>
                      {
                        noteUpdateID === note.id ? (
                          <Button size="small" onClick={() => submitEditNote(note.id)}> Okay </Button>
                        ) : (
                          <Button size="small" onClick={() => editNoteHandler(note.id, note.note)}> Edit </Button>
                        )
                      }
                  </CardActions>
                </Card>
              )
            })}
        </Grid>
      </Grid>
    </>
  );
}

export default withAuthenticator(App);
