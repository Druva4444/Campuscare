import React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import axios from 'axios';
import Cookies from 'js-cookie';
import { decodeToken } from 'react-jwt';
import StudHome from './Home';

// Mock dependencies
jest.mock('axios');
jest.mock('js-cookie');
jest.mock('react-jwt', () => ({
  decodeToken: jest.fn(),
}));

describe('StudHome Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    axios.post.mockReset();
    Cookies.get.mockReset();
    decodeToken.mockReset();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });
    cleanup();
    jest.clearAllMocks();
  });

  test('renders StudHome component elements', () => {
    Cookies.get.mockReturnValueOnce(undefined); // No user details or token
    render(<StudHome />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    // Use custom matcher for "Student" due to <br /> splitting text
    expect(screen.getByText((content, element) => content.includes('Student'))).toBeInTheDocument();
    // Use custom matcher for "Track your past and future appointment history"
    expect(
      screen.getByText((content, element) =>
        content.includes('Track your past and future appointment history')
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Appointment tracking')).toBeInTheDocument();
    expect(screen.getByText('No upcoming appointments')).toBeInTheDocument();
    expect(screen.getByText('Upcoming sessions')).toBeInTheDocument();
    expect(screen.getByText('Completed sessions')).toBeInTheDocument();
    // Check for two "0" elements (upcoming and completed sessions)
    expect(screen.getAllByText('0')).toHaveLength(2);
  });

  test('displays current date', () => {
    Cookies.get.mockReturnValueOnce(undefined);
    render(<StudHome />);

    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const expectedDate = `${currentDate.getFullYear()}-${month}-${currentDate.getDate()}`;
    expect(screen.getByText(expectedDate)).toBeInTheDocument();
  });

  test('displays current time', async () => {
    Cookies.get.mockReturnValueOnce(undefined);
    render(<StudHome />);

    // Advance timers to trigger setInterval
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      let seconds = now.getSeconds();
      const meridiem = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const expectedTime = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${meridiem}`;
      expect(screen.getByText(expectedTime)).toBeInTheDocument();
    });
  });

  test('fetches appointments with user details cookie', async () => {
    const mockUserDetails = JSON.stringify({ gmail: 'test@example.com' });
    Cookies.get.mockReturnValueOnce(mockUserDetails).mockReturnValueOnce(undefined);
    const mockAppointments = [
      { date: '2025-05-05T00:00:00Z', time: '10:00', acceptedby: 'Dr. Smith' },
    ];
    axios.post.mockResolvedValueOnce({
      data: {
        total: mockAppointments,
        upcom: mockAppointments,
        comi: [],
      },
    });

    render(<StudHome />);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3020/getStuhome', {
        email: 'test@example.com',
      });
    });

    await waitFor(() => {
      expect(screen.getByText('5/5/2025')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('10:00')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument(); // Upcoming sessions
    });

    await waitFor(() => {
      expect(screen.getByText('0')).toBeInTheDocument(); // Completed sessions
    });
  });

  test('fetches appointments with JWT token', async () => {
    Cookies.get.mockReturnValueOnce(undefined).mockReturnValueOnce('mockToken');
    decodeToken.mockReturnValueOnce({ gmail: 'test@example.com' });
    const mockAppointments = [
      { date: '2025-05-05T00:00:00Z', time: '10:00', acceptedby: 'Dr. Smith' },
    ];
    axios.post.mockResolvedValueOnce({
      data: {
        total: mockAppointments,
        upcom: mockAppointments,
        comi: [],
      },
    });

    render(<StudHome />);

    await waitFor(() => {
      expect(decodeToken).toHaveBeenCalledWith('mockToken');
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3020/getStuhome', {
        email: 'test@example.com',
      });
    });

    await waitFor(() => {
      expect(screen.getByText('5/5/2025')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('10:00')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument(); // Upcoming sessions
    });

    await waitFor(() => {
      expect(screen.getByText('0')).toBeInTheDocument(); // Completed sessions
    });
  });

  test('handles invalid JWT token', async () => {
    Cookies.get.mockReturnValueOnce(undefined).mockReturnValueOnce('invalidToken');
    decodeToken.mockImplementationOnce(() => {
      throw new Error('Invalid token');
    });

    render(<StudHome />);

    await waitFor(() => {
      expect(decodeToken).toHaveBeenCalledWith('invalidToken');
    });

    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText('No upcoming appointments')).toBeInTheDocument();
    });
  });

  test('handles API error when fetching appointments', async () => {
    const mockUserDetails = JSON.stringify({ gmail: 'test@example.com' });
    Cookies.get.mockReturnValueOnce(mockUserDetails).mockReturnValueOnce(undefined);
    axios.post.mockRejectedValueOnce(new Error('Network error'));

    render(<StudHome />);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3020/getStuhome', {
        email: 'test@example.com',
      });
    });

    await waitFor(() => {
      expect(screen.getByText('No upcoming appointments')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByText('0')).toHaveLength(2); // Upcoming and completed sessions
    });
  });

  test('displays NA for invalid appointment data', async () => {
    const mockUserDetails = JSON.stringify({ gmail: 'test@example.com' });
    Cookies.get.mockReturnValueOnce(mockUserDetails).mockReturnValueOnce(undefined);
    const mockAppointments = [
      { date: 'invalid-date', time: null, acceptedby: null },
    ];
    axios.post.mockResolvedValueOnce({
      data: {
        total: mockAppointments,
        upcom: [],
        comi: [],
      },
    });

    render(<StudHome />);

    await waitFor(() => {
      expect(screen.getAllByText('NA')).toHaveLength(3); // Date, time, and doctor
    });

    await waitFor(() => {
      expect(screen.getAllByText('0')).toHaveLength(2); // Upcoming and completed sessions
    });
  });

  test('cleans up interval on unmount', () => {
    Cookies.get.mockReturnValueOnce(undefined);
    jest.spyOn(global, 'clearInterval');
    const { unmount } = render(<StudHome />);

    unmount();
    expect(clearInterval).toHaveBeenCalled();
  });
});