import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../../src/presentation/pages/LoginPage';
import { login } from '../../src/domain/usecases/auth/login';

jest.mock('../../src/domain/usecases/auth/login', () => ({
  login: jest.fn()
}));

describe('LoginPage', () => {
  test('renders headings and form fields', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('submits credentials and shows success message', async () => {
    login.mockResolvedValueOnce({ accessToken: 'x', refreshToken: 'y' });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@acme.com', name: 'email' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123', name: 'password' } });

    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => expect(login).toHaveBeenCalled());
    expect(screen.getByRole('status')).toHaveTextContent(/signed in successfully/i);
  });

  test('shows error message on failure', async () => {
    login.mockRejectedValueOnce(new Error('Invalid credentials'));

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@acme.com', name: 'email' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123', name: 'password' } });

    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => expect(login).toHaveBeenCalled());
    expect(screen.getByRole('status')).toHaveTextContent(/invalid credentials/i);
  });
});
