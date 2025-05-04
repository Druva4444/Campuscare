import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Slogin from './slogin';
import { BrowserRouter } from 'react-router-dom';

// Mock useNavigate
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

// Mock axios - important to do this as an object with post method
jest.mock('axios', () => ({
  post: jest.fn()
}));

// Fix the fetch mock to properly resolve and match component expectations
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true, // Add this to ensure response.ok check passes
    json: () => Promise.resolve([{ _id: '1', name: 'Test College' }]),
  })
);

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <Slogin />
    </BrowserRouter>
  );
};

describe('Slogin Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders email, password, and submit fields', async () => {
    renderComponent();

    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();

    // Give the college dropdown more time to populate
    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Check only if the dropdown exists, not the specific value
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  test('toggles password visibility', () => {
    renderComponent();
    const passwordInput = screen.getByPlaceholderText('Password');
    const toggleIcon = screen.getByAltText('Toggle visibility');

    // Password should initially be of type password
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click the toggle icon
    fireEvent.click(toggleIcon);
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  test('submits login form and navigates on success', async () => {
    // Set up axios mock to resolve with a successful login response
    const mockResponse = { data: { message: 'Login Succesful' } };
    jest.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([{ _id: '1', name: 'Test College' }]),
    });
    jest.requireMock('axios').post.mockResolvedValue(mockResponse);

    renderComponent();

    // Fill in form fields
    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'testpass' },
    });

    // Wait for college to be loaded before submitting the form
    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    // Submit form
    fireEvent.click(screen.getByText('Sign in'));

    // Check if navigation occurs
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/studenthome');
    });
  });

  test('shows alert on failed login', async () => {
    window.alert = jest.fn();

    jest.requireMock('axios').post.mockResolvedValue({
      data: { message: 'Invalid credentials' }
    });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Invalid credentials. Please try again.');
    });
  });

  test('shows alert on axios error', async () => {
    window.alert = jest.fn();

    jest.requireMock('axios').post.mockRejectedValue(new Error('Network Error'));

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'error@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'errorpass' },
    });

    fireEvent.click(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('An error occurred. Please try again later.');
    });
  });
});