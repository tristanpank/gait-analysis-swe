import { render, screen } from '@testing-library/react';
import Home from './home-page.js';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';

test('renders home page', () => {
    render(
    <Router>
        <Routes>
        <Route path="/" element={<Home/>} />
        </Routes>
    </Router>
    );

    const helloElement = screen.getByText('Gait Analysis for UF Athletes');
    expect(helloElement).toBeInTheDocument();
    
});