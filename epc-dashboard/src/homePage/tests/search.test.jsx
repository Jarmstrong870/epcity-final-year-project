import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import HomePage from '../HomePage';
import { PropertyContext } from '../../Components/utils/propertyContext';

jest.mock('../../assets/liverpool.mp4', () => 'mocked-video.mp4');
jest.mock('../../assets/property.jpg', () => 'mocked-image.jpg');
jest.mock('../../assets/liverpool-houses.jpg', () => 'mocked-image.jpg');

const mockContext = {
  fetchTopRatedProperties: jest.fn().mockResolvedValue([]),
  topRatedProperties: [],
};

const cities = [
  'Liverpool',
  'Leeds',
  'Manchester',
  'Bristol',
  'Sheffield',
  'Birmingham',
  'Brighton',
  'Newcastle',
  'Southampton',
];

describe('HomePage Search Bar', () => {
  it('should accept city input and update correctly', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <PropertyContext.Provider value={mockContext}>
            <HomePage user={{}} language="en" />
          </PropertyContext.Provider>
        </MemoryRouter>
      );
    });

    const input = screen.getByPlaceholderText(/search for properties/i);
    const button = screen.getByRole('button', { name: /search/i });

    for (const city of cities) {
      await act(async () => {
        await userEvent.clear(input);
        await userEvent.type(input, city);
      });

      expect(input).toHaveValue(city);

      await act(async () => {
        await userEvent.click(button);
      });
    }
  });
});
