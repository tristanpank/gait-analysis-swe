import { render, screen } from '@testing-library/react';
import Login from './login-page.js';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';

test('renders login page', () => {
    const tempUser = {uid: undefined}
    render(
    <Router>
        <Routes>
        <Route path="/" element={<Login user={tempUser} />}  />
        </Routes>
    </Router>
    );

    const helloElement = screen.getByTestId('Login Form');
    expect(helloElement).toBeInTheDocument();
    
    
});