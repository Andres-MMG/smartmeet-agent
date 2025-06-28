import { render, screen } from '@testing-library/react';
import { Button } from '../../src/renderer/components/ui/Button';

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    const buttonElement = screen.getByText('Click me');
    expect(buttonElement).toBeInTheDocument();
  });

  test('renders button with primary variant by default', () => {
    render(<Button>Primary Button</Button>);
    const buttonElement = screen.getByText('Primary Button');
    expect(buttonElement).toHaveClass('bg-blue-600');
  });

  test('renders button with secondary variant', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const buttonElement = screen.getByText('Secondary Button');
    expect(buttonElement).toHaveClass('bg-gray-200');
  });

  test('renders disabled button', () => {
    render(<Button disabled>Disabled Button</Button>);
    const buttonElement = screen.getByText('Disabled Button');
    expect(buttonElement).toBeDisabled();
  });

  test('renders loading button', () => {
    render(<Button isLoading>Loading Button</Button>);
    const buttonElement = screen.getByText('Loading Button');
    expect(buttonElement).toBeDisabled();
  });
});