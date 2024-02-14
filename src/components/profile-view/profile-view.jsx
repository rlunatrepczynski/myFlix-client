import { useState } from "react";
import { Col, Row, Container } from "react-bootstrap";
import { Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MovieCard } from "../movie-card/movie-card";

export const ProfileView = ({ user, movies, setUser, removeFav, addFav }) => {
    const [username, setUsername] = useState(user.username);
    const [password, setPassword] = useState(user.password);
    const [email, setEmail] = useState(user.email);
    const [birthday, setBirthday] = useState(user.birthday);

    const navigate = useNavigate();

    //Returns list of favorite movies
    const favoriteMovieList = movies.filter(m => user.FavoriteMovies.include(m._id));

    const token = localStorage.getItem('token');

    //Updating user info
    const handleUpdate = (event) => {
        event.preventDefault();

        const user = JSON.parse(localStorage.getItem('user'));

        const data = {
            username: username,
            password: password,
            email: email,
            birthday: birthday
        };

        fetch(`https://renee-myflix-api-2507fb668e0f.herokuapp.com/users/${user.username}`, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }).then(async (response) => {
            console.log(response)
            if (response.ok) {
                const updatedUser = await response.json();
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                alert("Update was successful");
            } else {
                alert("Update failed")
            }
        }).catch(error => {
            console.error('Error: ', error);
        });
    };

    //Delete a User
    const handleDelete = () => {
        fetch(`https://renee-myflix-api-2507fb668e0f.herokuapp.com/users/${user.username}`, {
            method: "Delete",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.ok) {
                setUser(null);
                alert("User has been deleted")
                localStorage.clear();
                navigate('/'); // go back to home page
            } else {
                alert("Something went wrong.")
            }
        })
    }

    return (
        <Container className="my-5">
            <Row>
                <Col md={5}>
                    <Card>
                        <Card.Body>
                            <Card.Title>My Profile</Card.Title>
                            <Card.Img variant="top" src="https://via.placeholder.com/250" className="w-50 rounded" />
                            <Card.Text>Username: {user.username}</Card.Text>
                            <Card.Text>Email: {user.email}</Card.Text>
                            <Card.Text>Birthday: {user.birthday}</Card.Text>
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
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

