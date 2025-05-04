import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import Cookies from 'js-cookie';
import { decodeToken } from 'react-jwt';
import Docpatients from './docpatients';

// Mock dependencies
jest.mock('axios');
jest.mock('js-cookie');
jest.mock('react-jwt');
jest.mock('./ptmain', () => ({ det }) => (
  <div data-testid="patient-item" className="patient-mock">
    {det.createdy} - {det.date}
  </div>
));

describe('Docpatients Component', () => {
  const mockPatients = [
    { id: 1, createdy: 'John Doe', date: '2025-05-01', age: 45 },
    { id: 2, createdy: 'Jane Smith', date: '2025-05-02', age: 32 },
    { id: 3, createdy: 'Mike Johnson', date: '2025-05-03', age: 28 },
    { id: 4, createdy: 'Sarah Williams', date: '2025-04-29', age: 51 },
    { id: 5, createdy: 'Robert Brown', date: '2025-04-28', age: 39 },
  ];

  beforeEach(() => {
    // Mock date and time
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-05-04T12:30:45'));
    
    // Mock cookie retrieval
    Cookies.get.mockImplementation((key) => {
      if (key === 'userdetails') {
        return JSON.stringify({ gmail: 'doctor@example.com' });
      }
      return null;
    });
    
    // Mock axios response
    axios.post.mockResolvedValue({
      data: {
        patients: mockPatients,
        totalPages: 2
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test('renders the component with correct title', () => {
    render(<Docpatients />);
    expect(screen.getByText('Patients List')).toBeInTheDocument();
  });

  test('displays the current date and time', () => {
    render(<Docpatients />);
    expect(screen.getByText('2025-05-04')).toBeInTheDocument();
    // The time will be formatted as "12:30:45 PM" 
    expect(screen.getByText('12:30:45 PM')).toBeInTheDocument();
  });

  test('fetches patients data on mount', async () => {
    render(<Docpatients />);
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3020/getpatients',
        expect.objectContaining({
          email: 'doctor@example.com',
          page: 1,
          limit: 5
        })
      );
    });
    
    await waitFor(() => {
      const patientItems = screen.getAllByTestId('patient-item');
      expect(patientItems).toHaveLength(5);
    });
  });

  test('handles pagination correctly', async () => {
    render(<Docpatients />);
    
    await waitFor(() => {
      expect(screen.getAllByTestId('patient-item')).toHaveLength(5);
    });
    
    // Click next page button
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3020/getpatients',
        expect.objectContaining({
          page: 2,
          limit: 5
        })
      );
    });
  });

  test('filters patients by date', async () => {
    render(<Docpatients />);
    
    await waitFor(() => {
      expect(screen.getAllByTestId('patient-item')).toHaveLength(5);
    });
    
    // Filter by date
    const dateFilter = screen.getByPlaceholderText('Filter by Date');
    fireEvent.change(dateFilter, { target: { value: '2025-05-01' } });
    
    // Only John Doe should be visible now
    await waitFor(() => {
      const patientItems = screen.getAllByTestId('patient-item');
      expect(patientItems).toHaveLength(1);
      expect(patientItems[0].textContent).toContain('John Doe');
    });
  });

  test('filters patients by name', async () => {
    render(<Docpatients />);
    
    await waitFor(() => {
      expect(screen.getAllByTestId('patient-item')).toHaveLength(5);
    });
    
    // Filter by name
    const nameFilter = screen.getByPlaceholderText('Filter by Createdy (name)');
    fireEvent.change(nameFilter, { target: { value: 'Jane' } });
    
    // Only Jane Smith should be visible now
    await waitFor(() => {
        const patientItems = screen.getAllByTestId('patient-item');
        expect(patientItems).toHaveLength(1);
      });
      
      await waitFor(() => {
        const patientItems = screen.getAllByTestId('patient-item');
        expect(patientItems[0].textContent).toContain('Jane Smith');
      });
      
  });

  test('filters patients by date range', async () => {
    render(<Docpatients />);
    
    await waitFor(() => {
      expect(screen.getAllByTestId('patient-item')).toHaveLength(5);
    });
    
    // Set date range
    const startDateFilter = screen.getByPlaceholderText('Start Range');
    const endDateFilter = screen.getByPlaceholderText('End Range');
    
    fireEvent.change(startDateFilter, { target: { value: '2025-04-28' } });
    fireEvent.change(endDateFilter, { target: { value: '2025-05-01' } });
    
    // Should show John Doe, Sarah Williams, and Robert Brown
    await waitFor(() => {
        const patientItems = screen.getAllByTestId('patient-item');
        expect(patientItems).toHaveLength(3);
      });
      
      await waitFor(() => {
        const patientItems = screen.getAllByTestId('patient-item');
        const patientTexts = patientItems.map(item => item.textContent);
        expect(patientTexts.some(text => text.includes('John Doe'))).toBeTruthy();
      });
      
      await waitFor(() => {
        const patientItems = screen.getAllByTestId('patient-item');
        const patientTexts = patientItems.map(item => item.textContent);
        expect(patientTexts.some(text => text.includes('Sarah Williams'))).toBeTruthy();
      });
      
      await waitFor(() => {
        const patientItems = screen.getAllByTestId('patient-item');
        const patientTexts = patientItems.map(item => item.textContent);
        expect(patientTexts.some(text => text.includes('Robert Brown'))).toBeTruthy();
      });

  });
  
  test('sorts patients by date - newest to oldest', async () => {
    render(<Docpatients />);
    
    await waitFor(() => {
      expect(screen.getAllByTestId('patient-item')).toHaveLength(5);
    });
    
    // Ensure default sort is newest to oldest
    const sortSelect = screen.getByRole('combobox');
    expect(sortSelect.value).toBe('newest');
    
    await waitFor(() => {
      const patientItems = screen.getAllByTestId('patient-item');
      // First item should be most recent (Mike Johnson - May 3)
      expect(patientItems[0].textContent).toContain('Mike Johnson');
    });
  });

  test('sorts patients by date - oldest to newest', async () => {
    render(<Docpatients />);
    
    await waitFor(() => {
      expect(screen.getAllByTestId('patient-item')).toHaveLength(5);
    });
    
    // Change sort to oldest to newest
    const sortSelect = screen.getByRole('combobox');
    fireEvent.change(sortSelect, { target: { value: 'oldest' } });
    
    await waitFor(() => {
      const patientItems = screen.getAllByTestId('patient-item');
      // First item should be oldest (Robert Brown - April 28)
      expect(patientItems[0].textContent).toContain('Robert Brown');
    });
  });

  test('handles token-based authentication if userdetails cookie is not available', async () => {
    // Change mock to return token instead of userdetails
    Cookies.get.mockImplementation((key) => {
      if (key === 'Uid1') {
        return 'mock-token';
      }
      return null;
    });
    
    // Mock token decoding
    decodeToken.mockReturnValue({ gmail: 'doctor-token@example.com' });
    
    render(<Docpatients />);
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:3020/getpatients',
        expect.objectContaining({
          email: 'doctor-token@example.com'
        })
      );
    });
  });

  test('handles api error gracefully', async () => {
    // Make the API call fail
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.post.mockRejectedValueOnce(new Error('Network error'));
    
    render(<Docpatients />);
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching patients:', 
        expect.any(Error)
      );
    });
    
    consoleErrorSpy.mockRestore();
  });

  test('updates time every second', async () => {
    render(<Docpatients />);
    
    // Initial time
    expect(screen.getByText('12:30:45 PM')).toBeInTheDocument();
    
    // Advance time by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Time should update
    expect(screen.getByText('12:30:46 PM')).toBeInTheDocument();
  });

  test('disables pagination buttons appropriately', async () => {
    render(<Docpatients />);
    
    await waitFor(() => {
        const prevButton = screen.getByText('Previous');
        expect(prevButton).toBeDisabled();
      });
      
      await waitFor(() => {
        const nextButton = screen.getByText('Next');
        expect(nextButton).not.toBeDisabled();
      });
      
    
    // Go to page 2
    fireEvent.click(screen.getByText('Next'));
    
    // Mock response for page 2
    axios.post.mockResolvedValueOnce({
      data: {
        patients: [], // Empty for simplicity
        totalPages: 2
      }
    });
    
    await waitFor(() => {
        const nextButton = screen.getByText('Next');
        expect(nextButton).toBeDisabled();
      });
      
      await waitFor(() => {
        const prevButton = screen.getByText('Previous');
        expect(prevButton).not.toBeDisabled();
      });
      
  });
});