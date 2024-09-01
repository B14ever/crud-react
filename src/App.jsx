import React, { useState, useEffect } from 'react';
import Header from './component/Header';
import List from './component/Lists';
import { Box, Button, Container, Divider, Grid, Modal, TextField, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

function App() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({ title: '', description: '', startingDate: null, endingDate: null });
  const [validationError, setValidationError] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setData({ title: '', description: '', startingDate: null, endingDate: null });
    setValidationError('');
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('http://localhost:8080/todo');
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        setList(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const handleAddTask = async (event) => {
    event.preventDefault();
    if (!data.title || !data.description || !data.startingDate || !data.endingDate) {
      setValidationError('All fields are required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const newData = await response.json();
      setList([...list, newData]);
      handleClose();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <React.Fragment>
      <Header />
      <Container
        maxWidth="md"
        sx={{ height: '660px' }}
        fixed
        style={{ backgroundColor: '#fff', marginTop: '1rem', paddingTop: '1rem', paddingBottom: '1rem' }}
      >
        <Grid container>
          <Grid item xs={8}></Grid>
          <Grid item xs={4}>
            <Button variant="contained" sx={{ px: 6 }} onClick={handleOpen}>
              Add
            </Button>
          </Grid>
        </Grid>
        <Divider sx={{ mt: 1 }} />
        <Grid container sx={{ mt: 1 }}>
          {list.map((item, index) => (
            <Grid item xs={12} md={6} key={index}>
              <List list={item} />
            </Grid>
          ))}
        </Grid>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Your Next Task
            </Typography>
            <Divider />
            <Box component="form" noValidate autoComplete="off" onSubmit={handleAddTask}>
              <Grid container spacing={4} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    id="outlined-basic"
                    label="Title"
                    variant="outlined"
                    fullWidth
                    value={data.title}
                    onChange={(e) => setData({ ...data, title: e.target.value })}
                    error={!data.title}
                    helperText={!data.title ? 'Title is required' : ''}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="filled-basic"
                    label="Description"
                    variant="filled"
                    fullWidth
                    multiline
                    rows={6}
                    value={data.description}
                    onChange={(e) => setData({ ...data, description: e.target.value })}
                    error={!data.description}
                    helperText={!data.description ? 'Description is required' : ''}
                  />
                </Grid>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Starting Date"
                      fullWidth
                      value={data.startingDate}
                      onChange={(newValue) => setData({ ...data, startingDate: newValue })}
                      renderInput={(params) => (
                        <TextField {...params} error={!data.startingDate} helperText={!data.startingDate ? 'Starting Date is required' : ''} />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Ending Date"
                      fullWidth
                      value={data.endingDate}
                      onChange={(newValue) => setData({ ...data, endingDate: newValue })}
                      renderInput={(params) => (
                        <TextField {...params} error={!data.endingDate} helperText={!data.endingDate ? 'Ending Date is required' : ''} />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                {validationError && (
                  <Grid item xs={12}>
                    <Typography color="error">{validationError}</Typography>
                  </Grid>
                )}
                <Divider />
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', mt: 2 }}>
                  <Button variant="contained" type="submit" sx={{ px: 6 }}>
                    Save
                  </Button>
                  <Button variant="outlined" sx={{ px: 6 }} onClick={handleClose}>
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Modal>
      </Container>
    </React.Fragment>
  );
}

export default App;
