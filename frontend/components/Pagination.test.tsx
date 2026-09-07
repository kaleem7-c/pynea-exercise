import { render, screen } from '@testing-library/react';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('renders nothing when there is only one page', () => {
    const { container } = render(<Pagination page={0} limit={24} totalCount={10} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('disables Previous on the first page', () => {
    render(<Pagination page={0} limit={24} totalCount={100} />);
    const prev = screen.getByText('← Previous');
    expect(prev.tagName).toBe('SPAN');
    expect(prev).toHaveAttribute('aria-disabled', 'true');
  });

  it('disables Next on the last page', () => {
    render(<Pagination page={4} limit={24} totalCount={100} />);
    const next = screen.getByText('Next →');
    expect(next.tagName).toBe('SPAN');
    expect(next).toHaveAttribute('aria-disabled', 'true');
  });

  it('links to the previous and next pages, carrying the query', () => {
    render(<Pagination query="pika" page={1} limit={24} totalCount={100} />);
    expect(screen.getByText('← Previous').closest('a')).toHaveAttribute('href', '/?q=pika');
    expect(screen.getByText('Next →').closest('a')).toHaveAttribute('href', '/?q=pika&page=2');
  });

  it('shows the current page and total pages', () => {
    render(<Pagination page={1} limit={24} totalCount={100} />);
    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
  });
});
