'use client';

import React, { useEffect, useState } from 'react';
import ProjectApiList from '@/app/api/ProjectApiList';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Checkbox,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import ConfirmationDialog from '@/components/dashboard/locationSetup/ConfirmationDialog';

export default function LocationManager() {
  const { apiLocation } = ProjectApiList();

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);

  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [typeToAdd, setTypeToAdd] = useState('state');
  const [newName, setNewName] = useState('');
  const [newActive, setNewActive] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [selectedType, setSelectedType] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [typeToDelete, setTypeToDelete] = useState<string>('');

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    const res = await axios.get(`${apiLocation}/getStates`);
    setStates(res.data);
  };

  const fetchCities = async (stateId: any) => {
    const res = await axios.get(`${apiLocation}/geCitiesbyId/${stateId}`);
    setCities(res.data);
  };

  const fetchLocalities = async (cityId: any) => {
    const res = await axios.get(`${apiLocation}/locality-by-city/${cityId}`);
    setLocalities(res.data.data);
  };

  const handleSave = async () => {
    try {
      if (!newName.trim()) {
        toast.error('Name is required');
        return;
      }

      const payload = {
        name: newName,
        active: newActive,
      };

      if (editMode && editingItem) {
        const id = editingItem.id;

        if (typeToAdd === 'state') {
          await axios.put(`${apiLocation}/updateState/${id}`, payload);
          fetchStates();
        } else if (typeToAdd === 'city') {
          await axios.put(`${apiLocation}/updateCity/${id}`, {
            ...payload,
            stateId: selectedState,
          });
          fetchCities(selectedState);
        } else if (typeToAdd === 'locality') {
          await axios.put(`${apiLocation}/updatelocality/${id}`, {
            ...payload,
            cityId: selectedCity,
          });
          fetchLocalities(selectedCity);
        }

        toast.success('Updated successfully');
      } else {
        if (typeToAdd === 'state') {
          await axios.post(`${apiLocation}/createStates`, payload);
          fetchStates();
        } else if (typeToAdd === 'city') {
          await axios.post(`${apiLocation}/createCities`, {
            ...payload,
            stateId: selectedState,
          });
          fetchCities(selectedState);
        } else if (typeToAdd === 'locality') {
          await axios.post(`${apiLocation}/createlocality`, {
            ...payload,
            stateId: selectedCity,
          });
          fetchLocalities(selectedCity);
        }

        toast.success('Created successfully');
      }

      setDialogOpen(false);
      setNewName('');
      setNewActive(true);
      setEditMode(false);
      setEditingItem(null);
    } catch (err) {
      toast.error('Error saving entry');
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete || !typeToDelete) return;

    try {
      if (typeToDelete === 'state') {
        await axios.delete(`${apiLocation}/deleteState/${itemToDelete.id}`);
        fetchStates();
      } else if (typeToDelete === 'city') {
        await axios.delete(`${apiLocation}/deleteCity/${itemToDelete.id}`);
        fetchCities(selectedState);
      } else if (typeToDelete === 'locality') {
        await axios.delete(`${apiLocation}/deletelocality/${itemToDelete.id}`);
        fetchLocalities(selectedCity);
      }

      toast.success('Deleted successfully');
    } catch (err) {
      toast.error('Failed to delete');
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      setTypeToDelete('');
    }
  };

  const confirmDelete = (item: any, type: string) => {
    setItemToDelete(item);
    setTypeToDelete(type);
    setDeleteDialogOpen(true);
  };

  const openDialogFor = (type: string, item?: any) => {
    setDialogOpen(true);
    setTypeToAdd(type);
    setEditMode(!!item);
    setEditingItem(item || null);
    setNewName(item?.name || '');
    setNewActive(item?.active ?? true);
  };

  return (
    <>
      <Box p={4}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Location Manager
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <FormControl size="small">
            <Select
              value={selectedType}
              onChange={async (e) => {
                const type = e.target.value;
                setSelectedType(type);

                if (type === 'city' && selectedState) {
                  await fetchCities(selectedState);
                } else if (type === 'locality' && selectedCity) {
                  await fetchLocalities(selectedCity);
                }
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="state">State</MenuItem>
              <MenuItem value="city">City</MenuItem>
              <MenuItem value="locality">Locality</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>State</InputLabel>
              <Select
                value={selectedState}
                label="State"
                onChange={async (e) => {
                  const stateId = e.target.value;
                  setSelectedState(stateId);
                  setSelectedCity('');
                  await fetchCities(stateId);
                }}
              >
                {states.map((s: any) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth disabled={!selectedState}>
              <InputLabel>City</InputLabel>
              <Select
                value={selectedCity}
                label="City"
                onChange={async (e) => {
                  const cityId = e.target.value;
                  setSelectedCity(cityId);
                  if (selectedType === 'locality') {
                    await fetchLocalities(cityId);
                  }
                }}
              >
                {cities.map((c: any) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => openDialogFor('locality')}
              disabled={!selectedCity}
              sx={{ backgroundColor: '#000', color: '#fff' }}
            >
              + Add Locality
            </Button>
          </Grid>
        </Grid>

        {/* Render Tables */}
        {selectedType === 'state' && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Active</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {states.map((s: any, i) => (
                <TableRow key={s.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.active ? 'Yes' : 'No'}</TableCell>
                  <TableCell align="right">
                    <Button onClick={() => openDialogFor('state', s)}>Edit</Button>
                    <Button color="error" onClick={() => confirmDelete(s, 'state')}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {selectedType === 'city' && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Active</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cities.map((c: any, i) => (
                <TableRow key={c.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.active ? 'Yes' : 'No'}</TableCell>
                  <TableCell align="right">
                    <Button onClick={() => openDialogFor('city', c)}>Edit</Button>
                    <Button color="error" onClick={() => confirmDelete(c, 'city')}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {selectedType === 'locality' && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Locality</TableCell>
                <TableCell>Active</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {localities.map((l: any, i) => (
                <TableRow key={l.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{l.name}</TableCell>
                  <TableCell>{l.active ? 'Yes' : 'No'}</TableCell>
                  <TableCell align="right">
                    <Button onClick={() => openDialogFor('locality', l)}>Edit</Button>
                    <Button color="error" onClick={() => confirmDelete(l, 'locality')}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Add Buttons */}
        <Box mt={3} display="flex" gap={2}>
          <Button variant="outlined" onClick={() => openDialogFor('state')}>
            + Add State
          </Button>
          <Button variant="outlined" onClick={() => openDialogFor('city')} disabled={!selectedState}>
            + Add City
          </Button>
        </Box>

        {/* Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>{editMode ? 'Edit' : 'Add'} {typeToAdd}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              fullWidth
              label={`Enter ${typeToAdd} name`}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox checked={newActive} onChange={(e) => setNewActive(e.target.checked)} />}
              label="Active"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>
              {editMode ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title={`Delete ${typeToDelete}`}
        message={`Are you sure you want to delete this ${typeToDelete}? This action cannot be undone.`}
      />
    </>
  );
}
