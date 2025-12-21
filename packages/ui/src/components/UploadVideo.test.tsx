import { describe, it, expect, jest } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UploadVideo } from './UploadVideo'

describe('UploadVideo', () => {
  it('renders upload zone', () => {
    const onUpload = jest.fn()
    render(<UploadVideo onUpload={onUpload} />)

    expect(screen.getByText(/drop your video here/i)).toBeInTheDocument()
    expect(screen.getByText(/choose file/i)).toBeInTheDocument()
  })

  it('displays supported formats', () => {
    const onUpload = jest.fn()
    render(<UploadVideo onUpload={onUpload} />)

    expect(
      screen.getByText(/supports mp4, mov, avi, webm/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/max 2gb/i)).toBeInTheDocument()
  })

  it('calls onUpload when file is selected via input', async () => {
    const user = userEvent.setup()
    const onUpload = jest.fn()
    render(<UploadVideo onUpload={onUpload} />)

    const file = new File(['video content'], 'test.mp4', { type: 'video/mp4' })
    const input = screen.getByLabelText(/choose video file/i)

    await user.upload(input, file)

    expect(onUpload).toHaveBeenCalledWith(file)
  })

  it('calls onUpload when file is dropped', () => {
    const onUpload = jest.fn()
    render(<UploadVideo onUpload={onUpload} />)

    const file = new File(['video content'], 'test.mp4', { type: 'video/mp4' })
    const dropZone = screen.getByTestId('upload-drop-zone')

    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [file],
      },
    })

    expect(onUpload).toHaveBeenCalledWith(file)
  })

  it('shows drag-over state when file is being dragged', () => {
    const onUpload = jest.fn()
    render(<UploadVideo onUpload={onUpload} />)

    const dropZone = screen.getByTestId('upload-drop-zone')

    fireEvent.dragOver(dropZone)
    expect(dropZone.className).toContain('border-purple-500')

    fireEvent.dragLeave(dropZone)
    expect(dropZone.className).not.toContain('border-purple-500')
  })

  it('displays error message when provided', () => {
    const onUpload = jest.fn()
    const errorMessage = 'Invalid file type'
    render(<UploadVideo onUpload={onUpload} error={errorMessage} />)

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('does not display error when error is null', () => {
    const onUpload = jest.fn()
    render(<UploadVideo onUpload={onUpload} error={null} />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('opens file dialog when Choose File button is clicked', async () => {
    const user = userEvent.setup()
    const onUpload = jest.fn()
    render(<UploadVideo onUpload={onUpload} />)

    const input = screen.getByLabelText(
      /choose video file/i
    ) as HTMLInputElement
    const clickSpy = jest.spyOn(input, 'click')

    const chooseButton = screen.getByRole('button', { name: /choose file/i })
    await user.click(chooseButton)

    expect(clickSpy).toHaveBeenCalled()
  })

  it('has correct ARIA attributes for accessibility', () => {
    const onUpload = jest.fn()
    render(<UploadVideo onUpload={onUpload} error="Test error" />)

    const input = screen.getByLabelText(/choose video file/i)
    expect(input).toHaveAttribute('aria-label', 'Choose video file')

    const alert = screen.getByRole('alert')
    expect(alert).toHaveAttribute('aria-live', 'polite')
  })

  it('accepts only video file types', () => {
    const onUpload = jest.fn()
    render(<UploadVideo onUpload={onUpload} />)

    const input = screen.getByLabelText(
      /choose video file/i
    ) as HTMLInputElement
    expect(input.accept).toBe(
      'video/mp4,video/quicktime,video/x-msvideo,video/webm'
    )
  })
})
