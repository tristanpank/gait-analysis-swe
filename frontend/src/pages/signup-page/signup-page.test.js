import { render, screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Signup from './signup-page.js';

test('renders login page', () => {
    render(
    <Router>
        <Routes>
        <Route path="/" element={<Signup/>} />
        </Routes>
    </Router>
    );

    const helloElement = screen.getByTestId('Signup Form');
    expect(helloElement).toBeInTheDocument();
    
    
});