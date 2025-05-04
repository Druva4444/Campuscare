import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { decodeToken } from 'react-jwt';
import Doctorsadmin from './Doctorsadmin';

// Mock the dependencies
jest.mock('axios');
jest.mock('js-cookie');
jest.mock('react-jwt');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));
jest.mock('./Mainbody', () => ({ std, appointments, upcoming, role }) => (
  <div data-testid="doctor-item" className="doctor-mock">
    {std.name} - {role}
    <div data-testid="completed-count">{appointments ? appointments.length : 0}</div>
    <div data-testid="upcoming-count">{upcoming ? upcoming.length : 0}</div>
  </div>
));

describe('Doctorsadmin Component', () => {
  const mockDoctors = [
    { id: 1, name: 'Dr. John Smith', specialty: 'Cardiology' },
    { id: 2, name: 'Dr. Emily Johnson', specialty: 'Neurology' },
    { id: 3, name: 'Dr. Michael Brown', specialty: 'Dermatology' }
  ];

  const mockCompleted = [
    [{ id: 1, status: 'completed' }, { id: 2, status: 'completed' }],
    [{ id: 3, status: 'completed' }],
    []
  ];

  const mockUpcoming = [
    [{ id: 4, status: 'upcoming' }],
    [{ id: 5, status: 'upcoming' }, { id: 6, status: 'upcoming' }],
    [{ id: 7, status: 'upcoming' }]
  ];

  const mockAdminData = {
    doctor: mockDoctors,
    students: [{ id: 1, name: 'Student 1' }, { id: 2, name: 'Student 2' }],
    accapp1: mockCompleted,
    upcomiapp1: mockUpcoming
  };

  beforeEach(() => {
    // Mock date and time
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-05-04T14:30:00'));
    
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock cookie retrieval
    Cookies.get.mockImplementation((key) => {
      if (key === 'userdetails') {
        return JSON.stringify({ gmail: 'admin@example.com', college: 'Test University' });
      }
      return null;
    });

    // Mock successful API response
    axios.post.mockResolvedValue({ data: mockAdminData });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // Helper function to render component within router context
  const renderWithRouter = (component) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  test('renders the Doctorsadmin component with correct title', () => {
    renderWithRouter(<Doctorsadmin />);
    expect(screen.getByText('Doctors List')).toBeInTheDocument();
  });

  test('displays the current date and time', () => {
    renderWithRouter(<Doctorsadmin />);
    
    // Check for date and time elements
    const dateElement = screen.getByText(/\d{1,2}\/\d{1,2}\/\d{4}/);
    expect(dateElement).toBeInTheDocument();
    
    const timeElement = screen.getByText(/\d{1,2}:\d{2}:\d{2}/);
    expect(timeElement).toBeInTheDocument();
  });

  test('updates time every second', () => {
    renderWithRouter(<Doctorsadmin />);
    
    // Get initial time display
    const initialTime = screen.getByText(/\d{1,2}:\d{2}:\d{2}/).textContent;
    
    // Advance timer by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Time should update
    const updatedTime = screen.getByText(/\d{1,2}:\d{2}:\d{2}/).textContent;
    expect(updatedTime).not.toBe(initialTime);
  });

  test('fetches doctor data from userdetails cookie', async () => {
    renderWithRouter(<Doctorsadmin />);
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3020/getadminhome', 
        { gmail: 'admin@example.com', college: 'Test University' }
      );
    });
    
    // Check that data is displayed correctly
    await waitFor(() => {
      const doctorItems = screen.getAllByTestId('doctor-item');
      expect(doctorItems).toHaveLength(3); // Should match mockDoctors.length
    });
  });

  test('fetches doctor data using token when userdetails cookie is not available', async () => {
    // Change mock to return token instead of userdetails
    Cookies.get.mockImplementation((key) => {
      if (key === 'Uid3') {
        return 'mock-admin-token';
      }
      return null;
    });
    
    // Mock token decoding
    decodeToken.mockReturnValue({ gmail: 'admin-token@example.com', clg: 'Token University' });
    
    renderWithRouter(<Doctorsadmin />);
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3020/getadminhome', 
        { gmail: 'admin-token@example.com', college: 'Token University' }
      );
    });
  });

  test('handles API error gracefully', async () => {
    // Mock console.error to prevent actual errors in test output
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Make the API call fail
    axios.post.mockRejectedValueOnce(new Error('Network error'));
    
    renderWithRouter(<Doctorsadmin />);
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching admin home data:', 
        expect.any(Error)
      );
    });
    
    consoleErrorSpy.mockRestore();
  });

  test('renders Add Doctor button with correct styling', () => {
    renderWithRouter(<Doctorsadmin />);
    
    const addButton = screen.getByText('Add Doctor');
    expect(addButton).toBeInTheDocument();
    expect(addButton).toHaveStyle({
      backgroundColor: '#0A7273',
      color: 'white'
    });
  });

  test('renders file upload input and button', () => {
    renderWithRouter(<Doctorsadmin />);
    
    const fileInput = screen.getByRole('button', { name: /Upload JSON File/i });
    expect(fileInput).toBeInTheDocument();
    
    const uploadButton = screen.getByText('Upload JSON File');
    expect(uploadButton).toBeInTheDocument();
    expect(uploadButton).toHaveStyle({
      backgroundColor: '#0A7273',
      color: 'white'
    });
  });

 



  test('prevents form submission when no file is selected', async () => {
    renderWithRouter(<Doctorsadmin />);
    
    // Find the upload button and click it without selecting a file
    const uploadButton = screen.getByText('Upload JSON File');
    fireEvent.click(uploadButton);
    
    // Axios should not be called for upload
    expect(axios.post).not.toHaveBeenCalledWith(
      'http://localhost:3020/doctorupload',
      expect.any(FormData)
    );
  });

  test('correctly renders doctor items with their appointments', async () => {
    renderWithRouter(<Doctorsadmin />);
    
  // Check doctor items length
await waitFor(() => {
    expect(screen.getAllByTestId('doctor-item')).toHaveLength(3);
  });
  
  // Doctor 1
  await waitFor(() => {
    expect(screen.getAllByTestId('doctor-item')[0].textContent).toContain('Dr. John Smith');
  });
  await waitFor(() => {
    expect(screen.getAllByTestId('doctor-item')[0].textContent).toContain('doctor');
  });
  await waitFor(() => {
    expect(screen.getAllByTestId('completed-count')[0].textContent).toBe('2');
  });
  await waitFor(() => {
    expect(screen.getAllByTestId('upcoming-count')[0].textContent).toBe('1');
  });
  
  // Doctor 2
  await waitFor(() => {
    expect(screen.getAllByTestId('completed-count')[1].textContent).toBe('1');
  });
  await waitFor(() => {
    expect(screen.getAllByTestId('upcoming-count')[1].textContent).toBe('2');
  });
  
  // Doctor 3
  await waitFor(() => {
    expect(screen.getAllByTestId('completed-count')[2].textContent).toBe('0');
  });
  await waitFor(() => {
    expect(screen.getAllByTestId('upcoming-count')[2].textContent).toBe('1');
  });
  
  });

  test('navigates to add doctor page on button click', () => {
    const navigateMock = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigateMock);
    
    renderWithRouter(<Doctorsadmin />);
    
    // Click the Add Doctor button
    const addButton = screen.getByText('Add Doctor');
    fireEvent.click(addButton);
    
    // Check if navigate was called with the correct path
    expect(navigateMock).toHaveBeenCalledWith('/adddoctor', expect.objectContaining({
      state: { college: 'Test University' }
    }));
  });

  test('handles no token and no user details gracefully', async () => {
    // Mock both cookie and token as null
    Cookies.get.mockReturnValue(null);
    
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    renderWithRouter(<Doctorsadmin />);
    
    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith('No user details or token found');
    });
    
    // API should not be called
    expect(axios.post).not.toHaveBeenCalled();
    
    consoleLogSpy.mockRestore();
  });

  test('handles token verification failure gracefully', async () => {
    // Mock cookies to return a token but make decoding fail
    Cookies.get.mockImplementation((key) => {
      if (key === 'Uid3') {
        return 'invalid-token';
      }
      return null;
    });
    
    // Make token decoding throw an error
    decodeToken.mockImplementation(() => {
      throw new Error('Invalid token');
    });
    
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    renderWithRouter(<Doctorsadmin />);
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Token verification failed:', 
        expect.any(Error)
      );
    });
    
    consoleErrorSpy.mockRestore();
  });
});