import { render, screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Signup from './signup-page.js';

test('renders login page', () => {
  const tempUser = {uid: undefined}  
  render(
    <Router>
        <Routes>
        <Route path="/" element={<Signup user={tempUser} />} />
        </Routes>
    </Router>
    );

    const helloElement = screen.getByTestId('Signup Page');
    expect(helloElement).toBeInTheDocument();
    
    
});