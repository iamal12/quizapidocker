import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import { ITournament } from "../../interface/tournament.interface"
import dayjs from "dayjs"
import { axiosInstance } from "../../controller/axios/axios"
import { tournamentRoutes } from "../../constants/routes"
import { useSnackbarStore } from "../../store/snackbar.store"

const columns: GridColDef<ITournament>[] = [
    {
        field: 'name',
        headerName: 'Name',
        width: 200
    },
    {
        field: 'description',
        headerName: 'Description',
        width: 200
    },
    {
        field: 'startTime',
        headerName: 'Start time',
        width: 200,
        valueFormatter: ({ value }) => dayjs(value).format('DD-MM-YYYY HH:MM')
    },
    {
        field: 'category',
        headerName: 'Category',
        width: 200,
        valueGetter: ({ row }) => row.category?.categoryName
    },
    {
        field: 'usersJoined',
        headerName: 'Users Joined',
        width: 200,
        valueGetter: ({ row }) => row.users.length
    },
    {
        field: 'maxNumber',
        headerName: 'Max Number',
        width: 200,
    }
]

export const TournamentTable = () => {
    const [rows, setRows] = useState<ITournament[]>([])
    const setSnackbar = useSnackbarStore(state => state.setSnackbar)


    const fetchTournaments = async () => {
        try {
            const response = await axiosInstance.get<ITournament[]>(tournamentRoutes.BASE)
            setRows(response.data)
        } catch (e) {
            setSnackbar({ severity: 'error', children: `${e}` })
        }
    }

    useEffect(() => {
        fetchTournaments()
    }, [])

    return <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
            pagination: {
                paginationModel: { page: 0, pageSize: 5 },
            },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
    />
}