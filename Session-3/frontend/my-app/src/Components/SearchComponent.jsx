import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  List,
  ListItem,
  ListItemText,
  Pagination,
  CircularProgress,
  Box,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import axiosInstance from '../Utils/axios';

export default function SearchComponent() {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleDialogClose = () => {
    setOpen(false)
    setItems([])
  }

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5); 
  const [totalPages, setTotalPages] = useState(0);

  const handleChange = async (data) => {
    if (!data || data.trim() === "") {
      setItems([]);
      setTotalPages(0);
      setPage(1);
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "/api/searchItems",
        { text: data },
        { withCredentials: true }
      );

      const results = response.data.data || [];
      setItems(results);
      setTotalPages(Math.ceil(results.length / rowsPerPage));
      setPage(1);
    } catch (err) {
      console.error(err);
      setItems([]);
      setTotalPages(0);
    }
    setLoading(false);
  };

  const debouncedFetch = useCallback(debounce(handleChange, 200), []);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const paginatedItems = items.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <>
      <TextField
        fullWidth
        sx={{ mb: 1 }}
        size="small"
        placeholder="Search Tasks"
        onClick={handleClickOpen}
        InputProps={{ readOnly: true }}
      />

      <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Search Tasks</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Type to search"
            type="text"
            fullWidth
            size="small"
            onChange={(e) => debouncedFetch(e.target.value)}
          />

          <Box sx={{ mt: 2 }}>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  py: 4,
                }}
              >
                <CircularProgress />
              </Box>
            ) : paginatedItems.length > 0 ? (
              <>
                <List>
                  {paginatedItems.map((task) => (
                    <ListItem key={task.id} divider>
                      <ListItemText
                        primary={task.title}
                        secondary={task.description}
                      />
                    </ListItem>
                  ))}
                </List>

                <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="small"
                  />
                </Box>
              </>
            ) : (
              <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
                No tasks found
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
