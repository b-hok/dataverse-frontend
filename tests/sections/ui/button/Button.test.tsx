import { render, fireEvent } from '@testing-library/react'
import { Button } from '../../../../src/sections/ui/button/Button'
import styles from '../../../../src/sections/ui/button/Button.module.scss'
import { vi } from 'vitest'

describe('Button', () => {
  const clickMeText = 'Click me'

  it('renders a button with the correct text', () => {
    const { getByText } = render(<Button>{clickMeText}</Button>)

    expect(getByText('Click me')).toBeInTheDocument()
  })

  it('applies the correct style classes based on the variant prop', () => {
    const { container } = render(<Button variant="secondary">{clickMeText}</Button>)

    expect(container.firstChild).toHaveClass(styles.secondary)
  })

  it('applies the correct style classes based on the size prop', () => {
    const { container } = render(<Button size="small">{clickMeText}</Button>)
    expect(container.firstChild).toHaveClass(styles.small)
  })

  it('calls the onClick function when the button is clicked', () => {
    const handleClick = vi.fn()
    const { getByText } = render(<Button onClick={handleClick}>{clickMeText}</Button>)

    fireEvent.click(getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('disables the button when isDisabled prop is true', () => {
    const { getByText } = render(<Button isDisabled>{clickMeText}</Button>)

    expect(getByText('Click me')).toBeDisabled()
  })

  it('adds "disabled" class to the button when isDisabled prop is true', () => {
    const { container } = render(<Button isDisabled>{clickMeText}</Button>)

    expect(container.firstChild).toHaveClass('disabled')
  })
})
