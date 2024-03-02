import { render, screen } from '@testing-library/react';
import App from './App';


test('Renders app', () => {
  render(<App />);

  const linkElement = screen.getByTestId('App');
  expect(linkElement).toBeInTheDocument();
});
