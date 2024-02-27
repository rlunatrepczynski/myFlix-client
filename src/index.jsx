import { createRoot } from 'react-dom/client';
import { MainView } from "./components/main-view/main-view";
//Import Container Bootstrap component
import Container from 'react-bootstrap/Container';

//importing bootstrap CSS file
import "bootstrap/dist/css/bootstrap.min.css";
// Import statement to indicate that you need to bundle `./index.scss`
import "./index.scss";

// Main component (will eventually use all the others)
const MyFlixApplication = () => {
    //MainView is wrapped with a Container Bootstrap component
    return (
        <Container>
            <MainView />
        </Container>
    );
};

// Finds the root of your app
const container = document.querySelector("#root");
const root = createRoot(container);
// Tells React to render your app in the root DOM element
root.render(<MyFlixApplication />);
