import React, { useState } from "react";
import { useQuery, gql, useLazyQuery } from "@apollo/client";

const QUERY_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      name
      username
      age
      nationality
    }
  }
`;

const QUERY_ALL_MOVIES = gql`
  query GetAllUMovies {
    movies {
      id
      name
      yearOfPublication
      isInTheaters
    }
  }
`;

const GET_MOVIE_BY_NAME = gql`
  query Movie($name: String!) {
    movie(name: $name) {
      name
      yearOfPublication
    }
  }
`;

function DisplayData() {
  const [movieSearched, setMovieSearched] = useState("");

  const { data, loading, error } = useQuery(QUERY_ALL_USERS);
  const { data: movieData } = useQuery(QUERY_ALL_MOVIES);
  const [fetchMovie, { data: movieSearchedData, error: movieError }] =
    useLazyQuery(GET_MOVIE_BY_NAME);

  if (loading) {
    return <h1>Data is Loading</h1>;
  }
  if (data) {
    console.log(data);
  }

  if (movieData) {
    console.log(movieData);
  }

  if (error) {
    console.log(error);
  }

  if (movieError) {
    console.log(movieError);
  }

  return (
    <div>
      <h1>List of Users</h1>
      {data &&
        data.users.map((user) => {
          return (
            <div>
              <h2>Name: {user.name}</h2>
              <h2>Username: {user.username}</h2>
              <h2>Age: {user.age}</h2>
              <h2>Nationality: {user.nationality}</h2>
            </div>
          );
        })}
      <br />
      <h1>List of Movies</h1>
      {movieData &&
        movieData.movies.map((movie) => {
          return (
            <div>
              <h2>Movie Name: {movie.name}</h2>
            </div>
          );
        })}

      <div>
        <input
          type="text"
          placeholder="Interstellar ..."
          onChange={(event) => {
            setMovieSearched(event.target.value);
          }}
        />
        <button
          onClick={() => {
            fetchMovie({
              variables: {
                name: movieSearched,
              },
            });
          }}
        >
          Fetch Data
        </button>
        <div>
          {movieSearchedData && (
            <div>
              {" "}
              <h1>MovieName: {movieSearchedData.movie.name}</h1>{" "}
              <h1>
                Released Date: {movieSearchedData.movie.yearOfPublication}
              </h1>{" "}
            </div>
          )}
          {movieError && <h1> Cannot Find The Movie</h1>}
        </div>
      </div>
    </div>
  );
}

export default DisplayData;
