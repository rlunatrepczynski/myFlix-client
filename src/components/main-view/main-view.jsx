import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

//Exports the created MainView component
export const MainView = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    const [user, setUser] = useState(storedUser ? storedUser : null);
    const [token, setToken] = useState(storedToken ? storedToken : null);

    //Use useState to delare a state variable that is called movies and passs the initial state (an empty array) as an argument to the useState()
    const [movies, setMovies] = useState([]);

    const [selectedMovie, setSelectedMovie] = useState(null);

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

    return (
        <div>
            {user && ( //Only render Logout Button if there is a logged-in user)}
                <button onClick={() => {
                    setUser(null);
                    setToken(null);
                    localStorage.clear();
                }}>Logout</button>
            )}

            <Row className="justify-content-md-center">
                {!user ? (
                    <Col md={5}>
                        <LoginView
                            onLoggedIn={(user, token) => {
                                setUser(user);
                                setToken(token);
                            }}
                        />
                        or
                        <SignupView />
                    </Col>

                ) : selectedMovie ? (
                    <Col md={8}>
                        <MovieView
                            movie={selectedMovie}
                            onBackClick={() => setSelectedMovie(null)}
                        />
                    </Col>
                ) : movies.length === 0 ? (
                    <div>The list is empty!</div>
                ) : (
                    <>
                        {movies.map((movie) => (
                            <Col className="mb-4" key={movie.id} md={3}>
                                <MovieCard
                                    movie={movie}
                                    onMovieClick={(newSelectedMovie) => {
                                        setSelectedMovie(newSelectedMovie);
                                    }}
                                />
                            </Col>
                        ))}
                    </>
                )}
            </Row>
        </div>
    );
};

