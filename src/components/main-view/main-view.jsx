import React, { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { ProfileView } from "../profile-view/profile-view";

// Exports the created MainView component
export const MainView = () => {
    // Retrieve user and token from local storage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");

    // State variables for user, token, movies, and searchQuery
    const [user, setUser] = useState(storedUser ? storedUser : null);
    const [token, setToken] = useState(storedToken ? storedToken : null);
    const [movies, setMovies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch movies from the API based on searchQuery and token
    useEffect(() => {
        if (!token) {
            return;
        }

        const apiUrl = searchQuery
            ? `https://renee-myflix-api-2507fb668e0f.herokuapp.com/movies?Title=${searchQuery}`
            : 'https://renee-myflix-api-2507fb668e0f.herokuapp.com/movies';

        fetch(apiUrl, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => response.json())
            .then((data) => {
                const moviesFromApi = data.map((movie) => ({
                    id: movie._id,
                    ImageURL: movie.ImageURL,
                    Title: movie.Title,
                    Description: movie.Description,
                    Genre: { Name: movie.Genre.Name },
                    Director: { Name: movie.Director.Name },
                    Featured: movie.Featured
                }));
                setMovies(moviesFromApi);
            });
    }, [token, searchQuery]);

    // Function to add a movie to favorites
    const addFav = (id) => {
        fetch(`https://renee-myflix-api-2507fb668e0f.herokuapp.com/users/${user.username}/movies/${id}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    alert("Failed to add Favorite Movie");
                    throw new Error("Failed to add Favorite Movie");
                }
            })
            .then((updatedUser) => {
                alert("Added Favorite Movie successfully");
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
            })
            .catch(error => {
                console.error('Error: ', error);
            });
    }

    // Function to remove a movie from favorites
    const removeFav = (id) => {
        fetch(`https://renee-myflix-api-2507fb668e0f.herokuapp.com/users/${user.username}/movies/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    alert("Failed to remove favorite movie");
                    throw new Error("Failed to remove favorite movie");
                }
            })
            .then((updatedUser) => {
                alert("Removed successfully from favorite movies");
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
            })
            .catch(error => {
                console.error('Error: ', error);
            });
    };

    return (
        <div>
            <BrowserRouter>
                {/* Navigation Bar component */}
                <NavigationBar
                    user={user}
                    onLoggedOut={() => setUser(null)}
                />

                {/* Routes for different views */}
                <Routes>
                    {/* SignupView route */}
                    <Route
                        path="/signup"
                        element={
                            <>
                                {user ? (
                                    <Navigate to="/" />
                                ) : (
                                    <Col md={5}>
                                        <SignupView />
                                    </Col>
                                )}
                            </>
                        }
                    />

                    {/* LoginView route */}
                    <Route
                        path="/login"
                        element={
                            <>
                                {user ? (
                                    <Navigate to="/" />
                                ) : (
                                    <Col md={5}>
                                        <LoginView onLoggedIn={(user) => setUser(user)} />
                                    </Col>
                                )}
                            </>
                        }
                    />

                    {/* MovieView route */}
                    <Route
                        path="/movies/:movieId"
                        element={
                            <>
                                {!user ? (
                                    <Navigate to="/login" replace />
                                ) : movies.length === 0 ? (
                                    <Col>The list is empty!</Col>
                                ) : (
                                    <Col md={8}>
                                        <MovieView movies={movies} />
                                    </Col>
                                )}
                            </>
                        }
                    />

                    {/* ProfileView route */}
                    <Route
                        path="/profile"
                        element={
                            <>
                                {!user ? (
                                    <Navigate to="/login" replace />
                                ) : (
                                    <Col>
                                        <ProfileView
                                            user={user}
                                            token={token}
                                            movies={movies}
                                            setUser={setUser}
                                            addFav={addFav}
                                            removeFav={removeFav}
                                        />
                                    </Col>
                                )}
                            </>
                        }
                    />

                    {/* MovieCards route with filter input */}
                    <Route
                        path="/"
                        element={
                            <>
                                {!user ? (
                                    <Navigate to="/login" replace />
                                ) : movies.length === 0 ? (
                                    <Col>The list is empty!</Col>
                                ) : (
                                    <>
                                        <Row className="justify-content-md-center">
                                            <Col>
                                                {/* Filter input specific to MovieCard page */}
                                                <input
                                                    type="text"
                                                    placeholder="Search movies"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                            </Col>
                                        </Row>
                                        {/* MovieCard components mapped from movies */}
                                        <Row className="justify-content-md-center movie-grid">
                                            {movies
                                                .filter((movie) => movie.Title.toLowerCase().includes(searchQuery.toLowerCase()))
                                                .map((movie) => (
                                                    <Col className="mb-4" key={movie.id} md={3}>
                                                        <MovieCard
                                                            movie={movie}
                                                            addFav={addFav}
                                                            removeFav={removeFav}
                                                            isFavorite={user.FavoriteMovies && user.FavoriteMovies.includes(movie.id)}
                                                        />
                                                    </Col>
                                                ))}
                                        </Row>
                                    </>
                                )}
                            </>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </div>
    );
};
