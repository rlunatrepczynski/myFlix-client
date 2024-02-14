import { useParams } from "react-router";
import { Link } from "react-router-dom";
import './movie-view.scss';

//Import Prop Types
import PropTypes from 'prop-types';
export const MovieView = ({ movies }) => {
    const { movieId } = useParams();

    const movie = movies.find((b) => b.id === movieId);
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
                <button className="back-button"
                    style={{ cursor: "pointer " }} >
                    Back
                </button>
            </Link>
        </div>
    );
};
//Prop constrainsts for MovieView
MovieView.propTypes = {
    movie: PropTypes.shape({
        ImageURL: PropTypes.string.isRequired,
        Title: PropTypes.string.isRequired,
        Genre: PropTypes.shape({
            Name: PropTypes.string.isRequired,
        }),
        Description: PropTypes.string.isRequired,
        Director: PropTypes.shape({
            Name: PropTypes.string.isRequired,
        }),
    }).isRequired,
    onBackClick: PropTypes.func.isRequired,
};
