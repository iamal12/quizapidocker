import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { TournamentModal } from "../components/tournament/TournamentModal";
import { ICategory } from "../interface/category.interface";
import { axiosInstance } from "../controller/axios/axios";
import { categoryRoutes } from "../constants/routes";
import { TournamentTable } from "../components/tournament/Table";

export default function TournamentPage() {
    const [isOpened, setIsOpened] = useState(false)
    const [categories, setCategories] = useState<ICategory[]>([])
    const fetchCategories = async () => {
        const response = await axiosInstance.get<ICategory[]>(categoryRoutes.BASE)
        setCategories(response.data)
    }
    useEffect(() => { fetchCategories() }, [])
    return <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%',marginBottom: 3 }}>
            <Typography variant="h3">Tournament</Typography>
            <Button fullWidth={false} onClick={() => setIsOpened(true)}>Create Tournament</Button>
        </Box>

        <TournamentTable />
        <TournamentModal isOpened={isOpened} setIsOpened={setIsOpened} categories={categories} />
    </>
}