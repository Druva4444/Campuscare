import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dochome from './dochome';
import axios from 'axios';
import Cookies from 'js-cookie';
import { decodeToken } from 'react-jwt';

// Mock dependencies
jest.mock('axios');
jest.mock('js-cookie');
jest.mock('react-jwt');
jest.mock('./dochome.css', () => ({}));

describe('Dochome Component', () => {
  const mockAppointments = [
    { 
      id: 'app1',
      date: '2025-05-10', 
      time: '10:00 AM',
      patientEmail: 'patient1@example.com',
      status: 'completed'
    },
    { 
      id: 'app2',
      date: '2025-05-15', 
      time: '2:30 PM',
      patientEmail: 'patient2@example.com',
      status: 'completed'
    }
  ];

  const mockUpcomingAppointments = [
    { 
      id: 'app3',
      date: '2025-05-20', 
      time: '9:15 AM',
      patientEmail: 'patient3@example.com',
      status: 'upcoming'
    },
    { 
      id: 'app4',
      date: '2025-06-01', 
      time: '11:30 AM',
      patientEmail: 'patient4@example.com',
      status: 'upcoming'
    }
  ];

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Mock date/time to ensure consistent testing
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-05-04T10:30:00'));

    // Default mock responses
    Cookies.get.mockImplementation((key) => {
      if (key === 'userdetails') {
        return JSON.stringify({ gmail: 'doctor@example.com' });
      }
      return null;
    });

    axios.post.mockResolvedValue({
      data: { 
        total: mockAppointments,
        upcomi: mockUpcomingAppointments
      }
    });

    // Silence console logs during tests
    console.log = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
  });


  test('displays current date and time', () => {
    render(<Dochome />);
    
    // Check if the date is displayed (specific format for May 4, 2025)
    expect(screen.getByText('2025-5-4')).toBeInTheDocument();
    
    // Check if time is displayed in the proper format
    expect(screen.getByText('10.30.00 AM')).toBeInTheDocument();
    
    // Advance time by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Time should update
    expect(screen.getByText('10.30.01 AM')).toBeInTheDocument();
  });


 

  test('gets user email from cookies', async () => {
    render(<Dochome />);
    
    await waitFor(() => {
        expect(Cookies.get).toHaveBeenCalledWith('userdetails');
      });
      
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:3020/gethome',
          { email: 'doctor@example.com' }
        );
      });
      
  });

  test('falls back to token for user email', async () => {
    // Clear userdetails cookie and mock token instead
    Cookies.get.mockImplementation((key) => {
      if (key === 'Uid1') {
        return 'mock-token';
      }
      return null;
    });
    
    decodeToken.mockReturnValue({ gmail: 'token-doctor@example.com' });
    
    render(<Dochome />);
    
    await waitFor(() => {
        expect(Cookies.get).toHaveBeenCalledWith('userdetails');
      });
      
      await waitFor(() => {
        expect(Cookies.get).toHaveBeenCalledWith('Uid1');
      });
      
      await waitFor(() => {
        expect(decodeToken).toHaveBeenCalledWith('mock-token');
      });
      
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:3020/gethome',
          { email: 'token-doctor@example.com' }
        );
      });
    });

  test('handles case when no appointments exist', async () => {
    // Mock empty response
    axios.post.mockResolvedValue({
      data: { 
        total: [],
        upcomi: []
      }
    });
    
    render(<Dochome />);
    
    await waitFor(async () => {
      // Should show 0 counts
      await waitFor(() => {
        const zeroCounts = screen.getAllByText('0');
        expect(zeroCounts.length).toBe(2); // One for upcoming, one for completed
      });
      
      await waitFor(() => {
        const naElements = screen.getAllByText('NA');
        expect(naElements.length).toBeGreaterThan(0);
      });
    });
  });

  test('handles API error gracefully', async () => {
    // Mock API failure
    axios.post.mockRejectedValue(new Error('Network error'));
    
    render(<Dochome />);
    
    await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });
      
      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
          'Error fetching appointment count:',
          expect.any(Error)
        );
      });
      
      await waitFor(() => {
        const zeroCounts = screen.getAllByText('0');
        expect(zeroCounts.length).toBe(2); // One for upcoming, one for completed
      });
      
  });

  test('cleans up interval on unmount', () => {
    const { unmount } = render(<Dochome />);
    
    // Mock clearInterval
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    
    // Unmount component
    unmount();
    
    // Check if clearInterval was called
    expect(clearIntervalSpy).toHaveBeenCalled();
    
    clearIntervalSpy.mockRestore();
  });

  test('formats time correctly in 12-hour format', () => {
    // Set time to afternoon to test PM
    jest.setSystemTime(new Date('2025-05-04T14:45:30'));
    
    render(<Dochome />);
    
    // Check if time is displayed in 12-hour format with PM
    expect(screen.getByText('02.45.30 PM')).toBeInTheDocument();
  });
});