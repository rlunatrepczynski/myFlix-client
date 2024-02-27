import { useState } from "react";
import { Col, Row, Container } from "react-bootstrap";
import { Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MovieCard } from "../movie-card/movie-card";

export const ProfileView = ({ user, token, movies, setUser, removeFav, addFav }) => {
    const [username, setUsername] = useState(user?.username || '');
    const [password, setPassword] = useState(user?.password || '');
    const [email, setEmail] = useState(user?.email || '');
    const [birthday, setBirthday] = useState(user?.birthday || '');

    let favoriteMoviesList = movies.filter(m => user?.favoriteMovies?.includes(m.id) || false);

    const navigate = useNavigate();

    const handleUpdate = async (event) => {
        event.preventDefault();

        const data = {
            username: username,
            password: password,
            email: email,
            birthday: formatDate(birthday)
        };

        try {
            const response = await fetch(`https://renee-myflix-api-2507fb668e0f.herokuapp.com/users/${user.username}`, {
                method: "PUT",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                const updatedUser = await response.json();
                alert("Update successful");
                setUser(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser));
            } else {
                alert("Update failed");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Update failed. Please try again.");
        }
    };

    const formatDate = (date) => {
        const formattedDate = new Date(date).toISOString().split('T')[0];
        return formattedDate;
    };

    const handleDelete = () => {
        fetch(`https://renee-myflix-api-2507fb668e0f.herokuapp.com/users/${user.username}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.ok) {
                setUser(null);
                alert("User deleted");
                localStorage.clear();
                navigate('/');
            } else {
                alert("User delete unsuccessful");
            }
        });
    };

    return (
        <Container className="my-5">
            <Row>
                <Col md={5}>
                    <Card>
                        <Card.Body>
                            <Card.Title>User Profile</Card.Title>
                            <Card.Img variant="top" src="https://via.placeholder.com/250" className="w-50 rounded" />
                            <Card.Text>Username: {user.username}</Card.Text>
                            <Card.Text>Email: {user.email}</Card.Text>
                            <Card.Text>Birthday: {formatDate(user.birthday)}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={7}>
                    <Form onSubmit={handleUpdate}>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Username:</Form.Label>
                            <Form.Control
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                minLength="3"
                                placeholder={user.username}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                            <Form.Label>Password:</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="*****"
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={user.email}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBirthday">
                            <Form.Label>Birthday:</Form.Label>
                            <Form.Control
                                type="date"
                                value={birthday}
                                onChange={(e) => setBirthday(e.target.value)}
                                placeholder={user.birthday}
                            />
                        </Form.Group>
                        <Button type="submit" onClick={handleUpdate} className="mt-2">Update</Button>
                        <Button onClick={handleDelete} className="mt-2">Delete User</Button>
                    </Form>
                </Col>
            </Row>
            <Row>
                <h2>Favorite Movies</h2>
                <Row className="justify-content-center">
                    {favoriteMoviesList?.length !== 0 ? (
                        favoriteMoviesList?.map((movie) => (
                            <Col key={movie.id}>
                                <MovieCard
                                    movie={movie}
                                    removeFav={() => removeFav(movie.id)}
                                    addFav={() => addFav(movie.id)}
                                    // Pass the correct value for isFavorite
                                    isFavorite={true}  // Change this to the correct condition based on your logic
                                    // Pass the correct function for removeFromFavorites
                                    removeFromFavorites={() => removeFav(movie.id)}
                                />
                            </Col>
                        ))
                    ) : <Col>
                        <p>There are no favorites Movies</p>
                    </Col>
                    }
                </Row>
            </Row>
        </Container>
    );
};

