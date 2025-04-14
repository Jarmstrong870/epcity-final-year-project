import React from 'react';
import {
  render,
  fireEvent,
  screen,
  waitFor,
} from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PropertyList from '../../propertySearch/PropertyList';
import ComparePage from '../ComparePage';
import { PropertyContext } from '../utils/propertyContext';
import { FavouriteContext } from '../utils/favouriteContext';
import '@testing-library/jest-dom';

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

jest.mock('../propertyPage/propertyUtils', () => ({
  ...jest.requireActual('../propertyPage/propertyUtils'),
  fetchLocationCoords: jest.fn().mockResolvedValue({
    lat: 0,
    lng: 0,
    imageURL: 'mocked-url',
  }),
}));

const mockProperties = [
  {
    uprn: '1',
    address: '123 Fake Street',
    postcode: 'AB12 3CD',
    property_type: 'House',
    number_bedrooms: 3,
    current_energy_rating: 'C',
    current_energy_efficiency: 70,
  },
  {
    uprn: '2',
    address: '456 Elm Street',
    postcode: 'EF45 6GH',
    property_type: 'Flat',
    number_bedrooms: 2,
    current_energy_rating: 'B',
    current_energy_efficiency: 80,
  },
];

const mockPropertyContext = {
  properties: mockProperties,
  getNewPage: jest.fn(),
  sortProperties: jest.fn(),
  page: 1,
};

const mockFavouriteContext = {
  addFavourite: jest.fn(),
  removeFavourite: jest.fn(),
  isFavourited: jest.fn().mockReturnValue(false),
  favouriteProperties: [],
};

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/" element={ui} />
        <Route path="/compare-results" element={<ComparePage language="en" />} />
      </Routes>
    </MemoryRouter>
  );
};

jest.setTimeout(10000);

describe('ComparePage Integration Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProperties),
      })
    );
  });

  it('navigates to compare-results and displays EPC and Heating info', async () => {
    renderWithRouter(
      <PropertyContext.Provider value={mockPropertyContext}>
        <FavouriteContext.Provider value={mockFavouriteContext}>
          <PropertyList user={{}} loading={false} language="en" />
        </FavouriteContext.Provider>
      </PropertyContext.Provider>
    );

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);

    const compareBtn = screen
      .getAllByText(/Compare/i)
      .find((el) => el.tagName === 'BUTTON' && !el.disabled);
    fireEvent.click(compareBtn);

    // Wait for ComparePage to render
    await waitFor(() => {
      const costHeadings = screen.getAllByText(/Estimated Costs/i);
      expect(costHeadings.length).toBeGreaterThan(1);
    });

    //  Open EPC Info Accordion
    const epcAccordion = screen
      .getAllByText(/EPC Information/i)
      .find((btn) => btn.tagName === 'DIV');
    expect(epcAccordion).toBeTruthy();
    fireEvent.click(epcAccordion);

    //  Click EPC Tab
    const epcTab = screen.getAllByRole('button').find((btn) =>
      btn.textContent.toLowerCase().includes('epc rating')
    );
    expect(epcTab).toBeTruthy();
    fireEvent.click(epcTab);

    await waitFor(() => {
      expect(screen.getByText(/Current EPC Grade/i)).toBeInTheDocument();
    });

    //  Open Energy Info Accordion
    const energyAccordion = screen
      .getAllByText(/Energy Information/i)
      .find((btn) => btn.tagName === 'DIV');
    expect(energyAccordion).toBeTruthy();
    fireEvent.click(energyAccordion);

    //  Click Heating Tab
    const heatingTab = screen.getAllByRole('button').find((btn) =>
      btn.textContent.trim().toLowerCase() === 'heating'
    );
    expect(heatingTab).toBeTruthy();
    fireEvent.click(heatingTab);

    await waitFor(() => {
      expect(screen.getByText(/Current Annual Cost/i)).toBeInTheDocument();
    });
  });
});
