import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, TextField } from "@mui/material";
import React, { useReducer } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { ICategory } from "../../interface/category.interface";
import dayjs from "dayjs";
import { axiosInstance } from "../../controller/axios/axios";
import { tournamentRoutes } from "../../constants/routes";
import { useSnackbarStore } from "../../store/snackbar.store";

type Props = {
    isOpened: boolean;
    setIsOpened: (value: boolean) => void
    categories: ICategory[]
}

interface IFormData {
    name: string
    description: string
    category?: string
    startTime: string
    maxNumber: number
}

const initialData: IFormData = {
    name: '',
    description: '',
    startTime: '',
    maxNumber: 2
}

type ActionType = 'NAME' | 'DESCRIPTION' | 'START_TIME' | 'CATEGORY' | 'MAX_NUMBER'

const formAction = (state = initialData, action: { type: ActionType, payload: any }) => {
    switch (action.type) {
        case "NAME": return { ...state, name: action.payload }
        case "DESCRIPTION": return { ...state, description: action.payload }
        case "START_TIME": {
            const formattedDate = dayjs(action.payload).format();
            return { ...state, startTime: formattedDate }
        }
        case 'CATEGORY': return { ...state, category: action.payload }
        case 'MAX_NUMBER': return { ...state, maxNumber: action.payload }
    }
}

export const TournamentModal: React.FC<Props> = ({ isOpened, setIsOpened, categories }) => {
    const [form, setForm] = useReducer(formAction, initialData)

    const categoryOptions = categories.map(value => ({ label: value.categoryName, value: value.id }))

    const setSnackbar = useSnackbarStore(state => state.setSnackbar)

    const saveData = async () => {
        try {
            await axiosInstance.post(tournamentRoutes.BASE, form)
            setIsOpened(false)
        } catch (e: any) {
            const error = e.response?.data?.message?.[0] ?? e
            setSnackbar({ severity: 'error', children: `${error}` })
        }
    }
    return (
        <Dialog maxWidth='md' fullWidth open={isOpened} onClose={() => setIsOpened(false)}>
            <DialogTitle>Create Tournament</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    id="name"
                    label="Name"
                    value={form.name}
                    onChange={(e) => setForm({ payload: e.target.value, type: 'NAME' })}
                />
                <TextField
                    id="description"
                    label="description"
                    multiline
                    rows={2}
                    value={form.description}
                    onChange={(e) => setForm({ payload: e.target.value, type: 'DESCRIPTION' })}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker sx={{ marginBottom: 2 }} label="Basic date time picker" onChange={(newValue) => setForm({ payload: newValue, type: 'START_TIME' })} value={form.startTime ? dayjs(form.startTime) : dayjs()} />
                </LocalizationProvider>
                <Select value={form.category} onChange={(e) => setForm({ payload: e.target.value, type: 'CATEGORY' })}>
                    {categoryOptions.map(({ value, label }) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
                </Select>
                <TextField
                    id="maxNumber"
                    label="Maximum Users"
                    type="numberDESCRIPTION"
                    value={form.maxNumber}
                    onChange={(e) => setForm({ payload: e.target.value, type: 'MAX_NUMBER' })}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setIsOpened(false)}>Cancel</Button>
                <Button onClick={saveData}>Create</Button>
            </DialogActions>
        </Dialog>
    );
}