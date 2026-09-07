import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';

const push = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => new URLSearchParams(),
}));

describe('SearchBar', () => {
  beforeEach(() => {
    push.mockClear();
  });

  it('navigates to the list page with a q param on submit', async () => {
    render(<SearchBar />);
    const input = screen.getByLabelText('Search Pokemon');

    await userEvent.type(input, 'pikachu');
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(push).toHaveBeenCalledWith('/?q=pikachu');
  });

  it('navigates to the plain list page when the query is empty', async () => {
    render(<SearchBar />);

    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(push).toHaveBeenCalledWith('/');
  });
});
