import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { decodeToken } from 'react-jwt';
import Homeadmin from './Homeadmin';

// Mock dependencies
jest.mock('axios');
jest.mock('js-cookie');
jest.mock('react-jwt');

describe('Homeadmin Component', () => {
  const mockAdminData = {
    doctor: [{ id: 1, name: 'Dr. Smith' }, { id: 2, name: 'Dr. Johnson' }],
    students: [{ id: 1, name: 'Student 1' }, { id: 2, name: 'Student 2' }, { id: 3, name: 'Student 3' }],
    upcomingapp: [{ id: 1, details: 'Upcoming Appointment 1' }, { id: 2, details: 'Upcoming Appointment 2' }],
    completedapp: [{ id: 1, details: 'Completed Appointment 1' }]
  };

  beforeEach(() => {
    // Mock date and time
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-05-04T14:30:00'));
    
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock default cookie value
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

 





 

  test('handles api error gracefully', async () => {
    // Make the API call fail
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.post.mockRejectedValueOnce(new Error('Network error'));
    
    render(<Homeadmin />);
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching admin home data:', 
        expect.any(Error)
      );
    });
    
    consoleErrorSpy.mockRestore();
  });

  test('handles no user details or token gracefully', async () => {
    // Make Cookies.get return null for all keys
    Cookies.get.mockReturnValue(null);
    
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<Homeadmin />);
    
    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith('No user details or token found');
    });
    
    // API should not be called without gmail and college
    expect(axios.post).not.toHaveBeenCalled();
    
    consoleLogSpy.mockRestore();
  });



  test('waits for gmail and college before making API call', async () => {
    // Initially set up so neither gmail nor college are available
    Cookies.get.mockReturnValue(null);
    
    render(<Homeadmin />);
    
    // API should not be called initially
    expect(axios.post).not.toHaveBeenCalled();
    
    // Now simulate that we get user details later
    act(() => {
      // Simulate state updates that would happen after cookie/token processing
      Cookies.get.mockImplementation((key) => {
        if (key === 'userdetails') {
          return JSON.stringify({ gmail: 'late-admin@example.com', college: 'Late University' });
        }
        return null;
      });
    });
    
    // Force a re-render that would trigger the useEffect
    // This is simplified - in real code, the component would re-render due to state changes
    // We're simulating that here by forcing a change that would trigger the useEffect
    const { rerender } = render(<Homeadmin />);
    rerender(<Homeadmin />);
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3020/getadminhome', 
        expect.objectContaining({ gmail: 'late-admin@example.com' })
      );
    });
  });

  
});