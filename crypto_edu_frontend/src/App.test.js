import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app brand in header', () => {
  render(<App />);
  const brand = screen.getByText(/CryptoEdu/i);
  expect(brand).toBeInTheDocument();
});
