import {createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

const heroesAdapter = createEntityAdapter();

// const initialState = {
//     heroes: [],
//     heroesLoadingStatus: "idle",
//   };
const initialState = heroesAdapter.getInitialState({
    heroesLoadingStatus: "idle",
  });
  export const fetchHeroes = createAsyncThunk(
    'heroes/fetchHeroes',
    () => {
        const {request} = useHttp();
        return request('http://localhost:3001/heroes');
    }
  );
  const heroesSlice = createSlice({
    name: 'heroes',
    initialState,
    reducers: { 
        heroDeleted: (state, action) => {
            heroesAdapter.addOne(state, action.payload)
            // state.heroes = state.heroes.filter((item) => item.id !== action.payload)
        },
        heroAdd: (state, action) => {
            heroesAdapter.removeOne(state, action.payload)
            // state.heroes.push(action.payload)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHeroes.pending, state => {state.heroesLoadingStatus = "loading"})
            .addCase(fetchHeroes.fulfilled, (state, action) => {
                heroesAdapter.setAll(state, action.payload)
                state.heroesLoadingStatus = "idle"
            })
            .addCase(fetchHeroes.rejected, state => {state.heroesLoadingStatus = "error"})
            .addDefaultCase(() => {})
    }
});

const {actions, reducer} = heroesSlice;
export default reducer;
export const {selectAll} = heroesAdapter.getSelectors(state => state.heroes)
export const {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    heroDeleted,
    heroAdd
} = actions;

