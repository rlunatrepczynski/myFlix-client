import { useParams } from "react-router";
import { Link } from "react-router-dom";
import './movie-view.scss';

// Import Prop Types
import PropTypes from 'prop-types';

export const MovieView = ({ movies }) => {
    const { movieId } = useParams();

    // Find the movie based on movieId
    const movie = movies.find((b) => b.id === movieId);

    // Check if movie is not found or movieId is not provided
    if (!movie) {
        return <div>Movie not found</div>;
    }

    return (
        <div>
            <div>
                <img className="w-100" src={movie.ImageURL} alt="Movie Poster" />
            </div>
            <div>
                <span>Title: </span>
                <span>{movie.Title}</span>
            </div>
            <div>
                <span>Description: </span>
                <span>{movie.Description}</span>
            </div>
            <div>
                <span>Genre: </span>
                <span>{movie.Genre.Name}</span>
            </div>
            <div>
                <span>Director: </span>
                <span>{movie.Director.Name}</span>
            </div>
            <div>
                <span>Featured:</span>
                <span>{movie.Featured.toString()}</span>
            </div>
            <Link to={`/`}>
                <button className="back-button" style={{ cursor: "pointer " }}>
                    Back
                </button>
            </Link>
        </div>
    );
};

// Prop constraints for MovieView
MovieView.propTypes = {
    movies: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        ImageURL: PropTypes.string.isRequired,
        Title: PropTypes.string.isRequired,
        Genre: PropTypes.shape({
            Name: PropTypes.string.isRequired,
        }),
        Description: PropTypes.string.isRequired,
        Director: PropTypes.shape({
            Name: PropTypes.string.isRequired,
        }),
    })).isRequired,
};

