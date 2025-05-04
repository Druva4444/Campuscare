// NonNavbar.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import NonNavbar from './Dashboard';

// Mock axios
jest.mock('axios');

describe('NonNavbar Component', () => {
  const mockHomeData = {
    data: {
      clgs: [
        { id: 1, name: "Engineering College" },
        { id: 2, name: "Medical Sciences Institute" },
        { id: 3, name: "Business Management School" },
        { id: 4, name: "Arts and Design Academy" },
        { id: 5, name: "Science Research University" }
      ],
      admins: [
        { id: 101, name: "Rajesh Kumar", email: "rajesh@admin.edu" },
        { id: 102, name: "Priya Sharma", email: "priya@admin.edu" },
        { id: 103, name: "Amit Patel", email: "amit@admin.edu" },
        { id: 104, name: "Sneha Gupta", email: "sneha@admin.edu" },
        { id: 105, name: "Vikram Singh", email: "vikram@admin.edu" },
        { id: 106, name: "Neha Verma", email: "neha@admin.edu" }
      ],
      completedapp: [
        { id: 201, studentName: "Rahul Jain", date: "2025-04-20" },
        { id: 202, studentName: "Ananya Desai", date: "2025-04-19" },
        { id: 203, studentName: "Kunal Mehta", date: "2025-04-18" },
        { id: 204, studentName: "Divya Patel", date: "2025-04-17" }
      ],
      upcominapp: [
        { id: 301, studentName: "Rohit Sharma", date: "2025-05-07" },
        { id: 302, studentName: "Kavita Singh", date: "2025-05-08" },
        { id: 303, studentName: "Manish Verma", date: "2025-05-09" }
      ],
      amount: 150000
    }
  };

  beforeEach(() => {
    // Mock the API call
    axios.get.mockResolvedValue(mockHomeData);
    
    // Mock Date for consistent testing
    jest.spyOn(global, 'Date').mockImplementation(() => ({
      toLocaleDateString: () => '5/5/2025',
      toLocaleTimeString: () => '12:00:00 PM',
      getDate: () => 5,
      getMonth: () => 4, // May (0-indexed)
      getFullYear: () => 2025
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  

  test('displays the correct date and time', () => {
    render(<NonNavbar />);
    
    expect(screen.getByText('5/5/2025')).toBeInTheDocument();
    expect(screen.getByText('12:00:00 PM')).toBeInTheDocument();
  });

  test('displays the correct data after API call', async () => {
    render(<NonNavbar />);
    
    // Wait for the API call to resolve and component to update
  // Colleges count
await waitFor(() => {
    expect(screen.getByText('5')).toBeInTheDocument();
  });
  
  // Admins count
  await waitFor(() => {
    expect(screen.getByText('6')).toBeInTheDocument();
  });
  
  // Upcoming bookings count
  await waitFor(() => {
    expect(screen.getByText('3')).toBeInTheDocument();
  });
  await waitFor(() => {
    expect(screen.getByText('Upcoming Bookings')).toBeInTheDocument();
  });
  
  // Completed bookings count
  await waitFor(() => {
    expect(screen.getByText('4')).toBeInTheDocument();
  });
  await waitFor(() => {
    expect(screen.getByText('Completed Bookings')).toBeInTheDocument();
  });
  
  // Total income
  await waitFor(() => {
    expect(screen.getByText('Total Income: ₹ 150000')).toBeInTheDocument();
  });
  
  });

 
});