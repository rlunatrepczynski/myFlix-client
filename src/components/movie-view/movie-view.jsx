import './movie-view.scss';

//Import Prop Types
import PropTypes from 'prop-types';
export const MovieView = ({ movie, onBackClick }) => {
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
            <button onClick={onBackClick}
                className="back-button"
                style={{ cursor: "pointer " }} >
                Back
            </button>
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
