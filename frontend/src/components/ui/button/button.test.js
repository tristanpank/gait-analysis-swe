import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import Button from './button.js';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';

test('Button renders and clicks', async () => {
    var clicked = false

    function handleClick (e) {
        e.preventDefault()
        clicked = true
    }   

    render(
    <Router>
        <Routes>
        <Route path="/" element={<Button text={"hello world"} handleClick={handleClick}/>} />
        </Routes>
    </Router>
    );
    
    const button = screen.getByText('hello world');
    expect(button).toBeInTheDocument();

    // Use userEvent to simulate a click
    await userEvent.click(button);

    if (clicked) {
        expect(button).toBeInTheDocument();
    } else {
        // Fails test if doesn't class the handleClick function on click
        expect(button).toBeNull();
    }
});