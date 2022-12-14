import React, { useState } from "react";
import { useQuery, gql, useLazyQuery, useMutation } from "@apollo/client";

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

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      username
    }
  }
`;

function DisplayData() {
  //   Show a movie state
  const [movieSearched, setMovieSearched] = useState("");

  //   Create user state
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState(0);
  const [nationality, setNationality] = useState("");

  const { data, loading, refetch } = useQuery(QUERY_ALL_USERS);
  const { data: movieData } = useQuery(QUERY_ALL_MOVIES);
  const [fetchMovie, { data: movieSearchedData, error: movieError }] =
    useLazyQuery(GET_MOVIE_BY_NAME);

  const [createUser] = useMutation(CREATE_USER_MUTATION);

  if (loading) {
    return <h1>Data is Loading</h1>;
  }

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Name ..."
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Username ..."
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <input
          type="number"
          placeholder="Age ..."
          onChange={(event) => {
            setAge(event.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Nationality ..."
          onChange={(event) => {
            setNationality(event.target.value.toUpperCase());
          }}
        />
        <button
          onClick={() => {
            createUser({
              variables: {
                input: { name, username, age: Number(age), nationality },
              },
            });

            refetch();
          }}
        >
          Create User
        </button>
      </div>
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
