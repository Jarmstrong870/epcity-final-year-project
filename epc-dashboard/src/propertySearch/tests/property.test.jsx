import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PropertyList from '../PropertyList';
import { PropertyContext } from '../../Components/utils/propertyContext';
import { FavouriteContext } from '../../Components/utils/favouriteContext';
import '@testing-library/jest-dom';

const mockProperties = [
  {
    uprn: '1',
    address: '123 Fake Street',
    postcode: 'AB12 3CD',
    property_type: 'House',
    number_bedrooms: 3,
    current_energy_rating: 'C',
    current_energy_efficiency: 70
  },
  {
    uprn: '2',
    address: '456 Elm Street',
    postcode: 'EF45 6GH',
    property_type: 'Flat',
    number_bedrooms: 2,
    current_energy_rating: 'B',
    current_energy_efficiency: 80
  }
];

const mockFavouriteContext = {
  addFavourite: jest.fn(),
  removeFavourite: jest.fn(),
  isFavourited: jest.fn().mockReturnValue(false),
  favouriteProperties: []
};

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/" element={ui} />
        <Route path="/property/:uprn" element={<div>Mock Property Detail Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('PropertyList Full Feature Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('navigates to property detail when a card is clicked', () => {
    const mockContext = { ...mockPropertyContext };
    renderWithRouter(
      <PropertyContext.Provider value={mockContext}>
        <FavouriteContext.Provider value={mockFavouriteContext}>
          <PropertyList user={{}} loading={false} language="en" />
        </FavouriteContext.Provider>
      </PropertyContext.Provider>
    );
    fireEvent.click(screen.getByText(/123 Fake Street/i));
    expect(screen.getByText(/Mock Property Detail Page/i)).toBeInTheDocument();
  });

  it('triggers sort and order functions when changed', () => {
    const mockContext = { ...mockPropertyContext };
    renderWithRouter(
      <PropertyContext.Provider value={mockContext}>
        <FavouriteContext.Provider value={mockFavouriteContext}>
          <PropertyList user={{}} loading={false} language="en" />
        </FavouriteContext.Provider>
      </PropertyContext.Provider>
    );

    const [sortSelect, orderSelect] = screen.getAllByRole('combobox');
    fireEvent.change(sortSelect, { target: { value: 'number_bedrooms' } });
    expect(mockContext.sortProperties).toHaveBeenCalledWith('number_bedrooms', 'order');

    fireEvent.change(orderSelect, { target: { value: 'asc' } });
    expect(mockContext.sortProperties).toHaveBeenCalledWith('number_bedrooms', 'asc');
  });

  it('allows selecting up to 4 properties for comparison', () => {
    const mockContext = { ...mockPropertyContext };
    renderWithRouter(
      <PropertyContext.Provider value={mockContext}>
        <FavouriteContext.Provider value={mockFavouriteContext}>
          <PropertyList user={{}} loading={false} language="en" />
        </FavouriteContext.Provider>
      </PropertyContext.Provider>
    );

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);

    const compareBtn = screen.getAllByText(/Compare/i).find(el => el.tagName === 'BUTTON');
    expect(compareBtn).toBeEnabled();
    expect(compareBtn.textContent).toMatch(/2\/4/);
  });

  it('triggers getNewPage on pagination click', () => {
    const extendedContext = {
      properties: Array.from({ length: 31 }, (_, i) => ({
        uprn: String(i + 1),
        address: `${i + 1} Test Road`,
        postcode: `AB1 ${i + 1}CD`,
        property_type: 'House',
        number_bedrooms: 3,
        current_energy_rating: 'C',
        current_energy_efficiency: 70
      })),
      getNewPage: jest.fn(),
      sortProperties: jest.fn(),
      page: 1
    };

    renderWithRouter(
      <PropertyContext.Provider value={extendedContext}>
        <FavouriteContext.Provider value={mockFavouriteContext}>
          <PropertyList user={{}} loading={false} language="en" />
        </FavouriteContext.Provider>
      </PropertyContext.Provider>
    );

    const nextButton = screen.getByText(/Next/i);
    expect(nextButton).not.toBeDisabled();
    fireEvent.click(nextButton);
    expect(extendedContext.getNewPage).toHaveBeenCalledWith(2);
  });

  it('renders correct message when no properties found', () => {
    const emptyContext = { ...mockPropertyContext, properties: [] };
    renderWithRouter(
      <PropertyContext.Provider value={emptyContext}>
        <FavouriteContext.Provider value={mockFavouriteContext}>
          <PropertyList user={{}} loading={false} language="en" />
        </FavouriteContext.Provider>
      </PropertyContext.Provider>
    );
    expect(screen.getByText(/No properties found/i)).toBeInTheDocument();
  });
});

const mockPropertyContext = {
  properties: mockProperties,
  getNewPage: jest.fn(),
  sortProperties: jest.fn(),
  page: 1
};
