import { useState, useEffect } from "react";
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

//Exports the created MainView component
export const MainView = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    const [user, setUser] = useState(storedUser ? storedUser : null);
    const [token, setToken] = useState(storedToken ? storedToken : null);

    //Use useState to delare a state variable that is called movies and passs the initial state (an empty array) as an argument to the useState()
    const [movies, setMovies] = useState([]);

    //Fetch data from API and using setMovies, populate the movies state. Do this with the fetched movies array from myFlix API
    useEffect(() => {
        if (!token) {
            return;
        }

        fetch('https://renee-myflix-api-2507fb668e0f.herokuapp.com/movies', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                const moviesFromApi = data.map((movie) => {
                    return {
                        id: movie._id,
                        ImageURL: movie.ImageURL,
                        Title: movie.Title,
                        Description: movie.Description,
                        Genre: {
                            Name: movie.Genre.Name,
                        },
                        Director: {
                            Name: movie.Director.Name,
                        },
                        Featured: movie.Featured
                    };
                });
                setMovies(moviesFromApi);
            });
    }, [token]);

    // Add Favorite Movies
    const addFav = (id) => {
        console.log(`Adding movie with ID ${id} to favorites...`);
        fetch(`https://renee-myflix-api-2507fb668e0f.herokuapp.com/users/${user.username}/movies/${id}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            }
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
                console.log("User after adding favorite movie:", updatedUser);
                alert("Added Favorite Movie successfully");
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
            })
            .catch(error => {
                console.error('Error: ', error);
            });
    }

    // Delete Favorite Movies
    const removeFav = (id) => {
        console.log(`Removing movie with ID ${id} from favorites...`);
        fetch(`https://renee-myflix-api-2507fb668e0f.herokuapp.com/users/${user.username}/movies/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
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
                console.log("User after removing favorite movie:", updatedUser);
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
                <NavigationBar
                    user={user}
                    onLoggedOut={() => setUser(null)}
                />
                <Row className="justify-content-md-center">
                    <Routes>
                        {/*Returns SignupView, otherwise go back to mainpage*/}
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
                        {/*Returns LoginView, otherwise go back to mainpage*/}
                        <Route
                            path="/login"
                            element={
                                <>
                                    {user ? (
                                        <Navigate to="/" />
                                    ) : (
                                        <Col md={5}>
                                            <LoginView onLoggedIn={(user) => setUser(user)}
                                            />
                                        </Col>
                                    )}
                                </>

                            }
                        />
                        {/*Return MovieView if logged in, otherwise go to LoginView*/}
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
                        {/*Returns ProfileView, otherwise go to LoginView*/}
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
                        {/* Returns MovieCards, otherwise go to LoginView */}
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
                                            {movies.map((movie) => (
                                                <Col className="mb-4" key={movie.id} md={3}>
                                                    <MovieCard
                                                        movie={movie}
                                                        addFav={addFav}
                                                        removeFav={removeFav}
                                                        isFavorite={user.FavoriteMovies && user.FavoriteMovies.includes(movie.id)}
                                                    />
                                                </Col>
                                            ))}
                                        </>
                                    )}
                                </>
                            }
                        />
                    </Routes>
                </Row>
            </BrowserRouter>
        </div>
    );
};

