//Import Prop Types
import PropTypes from 'prop-types';
export const MovieView = ({ movie, onBackClick }) => {
    return (
        <div>
            <div>
                <img src={movie.ImageURL} alt="Movie Poster" />
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
            <button onClick={onBackClick}>Back</button>
        </div>
    );
};
//Prop constrainsts for MovieView
MovieView.propTypes = {
    movie: PropTypes.shape({
        ImageURL: PropTypes.string.isRequired,
        Title: PropTypes.string.isRequired,
        Genre: PropTypes.shape({
            GenreName: PropTypes.string.isRequired,
        }),
        Description: PropTypes.string.isRequired,
        Director: PropTypes.shape({
            Director: PropTypes.string.isRequired,
        }),
    }).isRequired,
    onBackClick: PropTypes.func.isRequired,
};
