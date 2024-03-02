import { render, screen } from '@testing-library/react';
import Dashboard from './dashboard-page.js';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';

test('renders hello world message', () => {
    render(
    <Router>
        <Routes>
        <Route path="/" element={<Dashboard/>} />
        </Routes>
    </Router>
    );
    
    const helloElement = screen.getByText('This is the Dashboard!');
    expect(helloElement).toBeInTheDocument();
});