import { render, screen } from '@testing-library/react';
import Home from './home-page.js';
import { Routes, Route, BrowserRouter as Router, MemoryRouter} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import App from '../../App';
import { HomeParallax } from './home-parallax.js';

test('Renders Header and HomeParallax components within the Home component', () => {
    render(
    <Router>
        <Home></Home>
    </Router>
    );

    const homeElement = screen.getByTestId("Home");
    const headerElement = screen.getByTestId("Header");
    const parallaxElement = screen.getByTestId("Parallax");
    expect(homeElement).toBeInTheDocument();
    expect(headerElement).toBeInTheDocument();
    expect(parallaxElement).toBeInTheDocument();
    
});

test('Renders HomeParallax with title, description, and LoginButton', () => {
    render(
      <Router>
        <HomeParallax />
      </Router>
    );
    
    const title = screen.getByText('UF Gait Analysis');
    const description = screen.getByText(/making the resources of expensive labs available for everyday runners/i);
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
});

test('Navigates to login page on LoginButton click', async () => {
    const history = createMemoryHistory();
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Add a mock route for /login to verify navigation */}
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  
    const loginButton = screen.getByTestId("Login Button");
    userEvent.click(loginButton);
  
    // Check that the URL changed to /login
    expect(await screen.findByText('Login Page')).toBeInTheDocument();
  });




