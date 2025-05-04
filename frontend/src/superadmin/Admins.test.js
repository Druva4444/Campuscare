// AdminList.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import AdminList from './Admins';

// Mock modules
jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

describe('AdminList Component', () => {
  const mockAdmins = [
    { 
      _id: '1', 
      email: 'admin1@example.com', 
      college: 'Engineering College', 
      cretedon: '2025-01-15T12:00:00.000Z' 
    },
    { 
      _id: '2', 
      email: 'admin2@example.com', 
      college: 'Medical College', 
      cretedon: '2025-02-20T14:30:00.000Z' 
    },
    { 
      _id: '3', 
      email: 'admin3@example.com', 
      college: 'Business School', 
      cretedon: '2025-03-10T09:15:00.000Z' 
    }
  ];

  beforeEach(() => {
    // Mock the API calls
    axios.get.mockResolvedValue({ data: { admins: mockAdmins } });
    axios.post.mockResolvedValue({ data: { message: 'Admin deleted successfully' } });
    
    // Mock Date for consistent testing
    jest.spyOn(global, 'Date').mockImplementation(() => ({
      toLocaleDateString: () => '5/5/2025',
      toLocaleTimeString: () => '12:00:00 PM',
      getDate: () => 5,
      getMonth: () => 4, // May (0-indexed)
      getFullYear: () => 2025
    }));

    // Mock window.location
    delete window.location;
    window.location = { href: '' };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component with initial state', async () => {
    render(
      <BrowserRouter>
        <AdminList />
      </BrowserRouter>
    );
    
    // Check for static elements
    expect(screen.getByText('Admins list')).toBeInTheDocument();
    expect(screen.getByText('Add Admin')).toBeInTheDocument();
    
    // Check date and time
    expect(screen.getByText('5/5/2025')).toBeInTheDocument();
    expect(screen.getByText('12:00:00 PM')).toBeInTheDocument();
  });



  test('handles delete admin functionality', async () => {
    render(
      <BrowserRouter>
        <AdminList />
      </BrowserRouter>
    );
    
    // Wait for admin data to load
    await waitFor(() => {
      expect(screen.getByText('admin1@example.com')).toBeInTheDocument();
    });
    
    // Click the delete button for the first admin
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    // Verify axios.post was called with correct parameters
  // Verify axios.post call
await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:3020/deleteadmins',
      { adminId: '1' },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      }
    );
  });
  
  // Verify redirect
  await waitFor(() => {
    expect(window.location.href).toBe('/superadmin_admins');
  });
  
  });

  test('handles API error during data fetch', async () => {
    // Mock API failure
    axios.get.mockRejectedValueOnce(new Error('API error'));
    
    // Spy on console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <BrowserRouter>
        <AdminList />
      </BrowserRouter>
    );
    
    // Wait for the API call to resolve and verify error was logged
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching college count:', expect.any(Error));
    });
    
    // Verify no admin data is displayed
    expect(screen.queryByText('admin1@example.com')).not.toBeInTheDocument();
    
    // Restore console.error
    console.error.mockRestore();
  });

  test('handles API error during admin deletion', async () => {
    // First load the component successfully
    render(
      <BrowserRouter>
        <AdminList />
      </BrowserRouter>
    );
    
    // Wait for admin data to load
    await waitFor(() => {
      expect(screen.getByText('admin1@example.com')).toBeInTheDocument();
    });
    
    // Mock delete API failure
    axios.post.mockRejectedValueOnce({ 
      response: { data: 'Permission denied' } 
    });
    
    // Spy on console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Click the delete button
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    // Verify error was logged
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error deleting user:', 'Permission denied');
    });
    
    // Restore console.error
    console.error.mockRestore();
  });

  test('navigates to add admin page when Add Admin button is clicked', async () => {
    const navigateMock = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigateMock);
    
    render(
      <BrowserRouter>
        <AdminList />
      </BrowserRouter>
    );
    
    // Click the Add Admin button
    const addButton = screen.getByText('Add Admin');
    fireEvent.click(addButton);
    
    // Verify navigation was attempted
    expect(navigateMock).toHaveBeenCalledWith('/admin/signup');
  });
});