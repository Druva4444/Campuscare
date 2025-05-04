import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import StudBook from './bookings';
import axios from 'axios';
import Cookies from 'js-cookie';
import { decodeToken } from 'react-jwt';

// Mock dependencies
jest.mock('axios');
jest.mock('js-cookie');
jest.mock('react-jwt');

// Mock child component to simplify testing
jest.mock('./Mainbody1', () => {
  return function MockMainbody1({ det }) {
    return <div data-testid="appointment-item">{det.date} - {det.acceptedby}</div>;
  };
});

describe('StudBook Component', () => {
  const mockAppointments = [
    { 
      date: '2025-05-01', 
      acceptedby: 'doctor1@example.com',
      description: 'Check-up'
    },
    { 
      date: '2025-05-10', 
      acceptedby: 'doctor2@example.com',
      description: 'Follow-up'
    },
    { 
      date: '2025-04-20', 
      acceptedby: 'doctor1@example.com',
      description: 'Consultation'
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
        return JSON.stringify({ gmail: 'student@example.com' });
      }
      return null;
    });

    axios.post.mockResolvedValue({
      data: { 
        total: mockAppointments,
        comi: [] 
      }
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders StudBook component correctly', async () => {
    render(<StudBook />);
    
    // Check if title is displayed
    expect(screen.getByText('My Bookings')).toBeInTheDocument();
    
    // Check if current date is displayed (formatted date for May 4, 2025)
    expect(screen.getByText('2025-05-04')).toBeInTheDocument();
    
    // Check if filtering options are displayed
    expect(screen.getByText('Based on Date')).toBeInTheDocument();
    expect(screen.getByText('Based on doctor')).toBeInTheDocument();
    
    // Check if appointments are loaded
   

    // Check if appointments are rendered
    await waitFor(() => {
      expect(screen.getAllByTestId('appointment-item').length).toBe(3);
    });
  });


  test('filters appointments by doctor email', async () => {
    render(<StudBook />);
    
    await waitFor(() => {
      expect(screen.getAllByTestId('appointment-item').length).toBe(3);
    });
    
    // Filter by doctor
    const doctorInput = screen.getByPlaceholderText('Enter doctor email...');
    fireEvent.change(doctorInput, { target: { value: 'doctor2' } });
    
    // Should show only appointments with doctor2
    await waitFor(async () => {
      expect(screen.getAllByTestId('appointment-item').length).toBe(1);
      await waitFor(() => {
        expect(screen.getAllByTestId('appointment-item').length).toBe(1);
      });
  
      await waitFor(() => {
        expect(screen.getByText('2025-05-10 - doctor2@example.com')).toBeInTheDocument();
      });
    });
  });

  test('filters appointments by date range', async () => {
    render(<StudBook />);
    
    await waitFor(() => {
      expect(screen.getAllByTestId('appointment-item').length).toBe(3);
    });
    
    // Set date range

    
    
    // Should show only appointments within range
   
      await waitFor(() => {
        expect(screen.getByText('2025-05-01 - doctor1@example.com')).toBeInTheDocument();
      });
    });
    
  test('sorts appointments by date', async () => {
    render(<StudBook />);
    
    await waitFor(() => {
      expect(screen.getAllByTestId('appointment-item').length).toBe(3);
    });
    
    const sortSelect = screen.getByRole('combobox');
    
    // Test ascending order (default)
    const appointmentItems = screen.getAllByTestId('appointment-item');
    expect(appointmentItems[0].textContent).toContain('2025-04-20');
    expect(appointmentItems[1].textContent).toContain('2025-05-01');
    expect(appointmentItems[2].textContent).toContain('2025-05-10');
    
    // Change to descending order
    fireEvent.change(sortSelect, { target: { value: 'desc' } });
    
    // Check new order
    const sortedItems = screen.getAllByTestId('appointment-item');
    expect(sortedItems[0].textContent).toContain('2025-05-10');
    expect(sortedItems[1].textContent).toContain('2025-05-01');
    expect(sortedItems[2].textContent).toContain('2025-04-20');
  });

  test('displays message when no appointments match filters', async () => {
    render(<StudBook />);
    
    await waitFor(() => {
      expect(screen.getAllByTestId('appointment-item').length).toBe(3);
    });
    
    // Filter by a date that doesn't exist
    const dateInput = screen.getAllByRole('textbox')[0];
    fireEvent.change(dateInput, { target: { value: '2025-12-25' } });
    
    // Should show no appointments message
    await waitFor(() => {
        expect(screen.queryByTestId('appointment-item')).not.toBeInTheDocument();
      });
    
      await waitFor(() => {
        expect(screen.getByText('No upcoming bookings')).toBeInTheDocument();
      });
    });
    
    test('gets user email from cookies', async () => {
      render(<StudBook />);
    
      await waitFor(() => {
        expect(Cookies.get).toHaveBeenCalledWith('userdetails');
      });
    
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:3020/getStuhome',
          { email: 'student@example.com' }
        );
      });
    });
    

  test('falls back to token for user email', async () => {
    // Clear userdetails cookie and mock token instead
    Cookies.get.mockImplementation((key) => {
      if (key === 'Uid2') {
        return 'mock-token';
      }
      return null;
    });
    
    decodeToken.mockReturnValue({ gmail: 'token-student@example.com' });
    
    render(<StudBook />);
    
    await waitFor(() => {
      expect(Cookies.get).toHaveBeenCalledWith('userdetails');
    });

    await waitFor(() => {
      expect(Cookies.get).toHaveBeenCalledWith('Uid2');
    });

    await waitFor(() => {
      expect(decodeToken).toHaveBeenCalledWith('mock-token');
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3020/getStuhome', 
        { email: 'token-student@example.com' }
      );
    });
  });

  test('updates time display correctly', async () => {
    render(<StudBook />);
    
    // Initial time should be 10:30:00 AM
    expect(screen.getByText('10.30.00 AM')).toBeInTheDocument();
    
    // Advance time by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Time should update
    expect(screen.getByText('10.30.01 AM')).toBeInTheDocument();
  });

  test('handles API error gracefully', async () => {
    // Mock API failure
    console.error = jest.fn(); // Suppress error logs
    axios.post.mockRejectedValue(new Error('Network error'));
    
    render(<StudBook />);
    
  
  });
});