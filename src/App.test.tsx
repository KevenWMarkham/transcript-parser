import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import App from './App'

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockObjectURL = 'blob:mock-url'
beforeEach(() => {
  global.URL.createObjectURL = jest.fn(
    () => mockObjectURL
  ) as unknown as typeof URL.createObjectURL
  global.URL.revokeObjectURL =
    jest.fn() as unknown as typeof URL.revokeObjectURL
})

describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />)
    expect(container).toBeInTheDocument()
  })

  it('initially shows upload component', () => {
    render(<App />)
    expect(screen.getByText(/drop your video here/i)).toBeInTheDocument()
  })

  it('shows error when invalid file is uploaded', async () => {
    const user = userEvent.setup()
    render(<App />)

    const file = new File(['content'], 'document.pdf', {
      type: 'application/pdf',
    })
    const input = screen.getByLabelText(/choose video file/i)

    await user.upload(input, file)

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/invalid file type/i)).toBeInTheDocument()
  })

  it('shows video preview when valid file is uploaded', async () => {
    const user = userEvent.setup()
    render(<App />)

    const file = new File(['video content'], 'test.mp4', {
      type: 'video/mp4',
    })

    // Create a mock video element for metadata extraction
    const mockVideo = document.createElement('video')
    Object.defineProperty(mockVideo, 'duration', { value: 60 })
    Object.defineProperty(mockVideo, 'videoWidth', { value: 1280 })
    Object.defineProperty(mockVideo, 'videoHeight', { value: 720 })

    const createElementSpy = jest.spyOn(document, 'createElement')
    createElementSpy.mockImplementation((tag: string) => {
      if (tag === 'video') {
        // Simulate loadedmetadata event
        setTimeout(() => {
          mockVideo.onloadedmetadata?.({} as Event)
        }, 0)
        return mockVideo
      }
      return document.createElement(tag)
    })

    const input = screen.getByLabelText(/choose video file/i)
    await user.upload(input, file)

    await waitFor(() => {
      expect(screen.getByText('Video Preview')).toBeInTheDocument()
    })

    expect(screen.getByText('test.mp4')).toBeInTheDocument()

    createElementSpy.mockRestore()
  })

  it('returns to upload state when remove button is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)

    const file = new File(['video content'], 'test.mp4', {
      type: 'video/mp4',
    })

    // Mock video metadata extraction
    const mockVideo = document.createElement('video')
    Object.defineProperty(mockVideo, 'duration', { value: 60 })
    Object.defineProperty(mockVideo, 'videoWidth', { value: 1280 })
    Object.defineProperty(mockVideo, 'videoHeight', { value: 720 })

    const createElementSpy = jest.spyOn(document, 'createElement')
    createElementSpy.mockImplementation((tag: string) => {
      if (tag === 'video') {
        setTimeout(() => {
          mockVideo.onloadedmetadata?.({} as Event)
        }, 0)
        return mockVideo
      }
      return document.createElement(tag)
    })

    const input = screen.getByLabelText(/choose video file/i)
    await user.upload(input, file)

    await waitFor(() => {
      expect(screen.getByText('Video Preview')).toBeInTheDocument()
    })

    const removeButton = screen.getByRole('button', { name: /remove video/i })
    await user.click(removeButton)

    expect(screen.getByText(/drop your video here/i)).toBeInTheDocument()
    expect(screen.queryByText('Video Preview')).not.toBeInTheDocument()

    createElementSpy.mockRestore()
  })

  it('clears error when valid file is uploaded after invalid file', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Upload invalid file
    const invalidFile = new File(['content'], 'document.pdf', {
      type: 'application/pdf',
    })
    const input = screen.getByLabelText(/choose video file/i)
    await user.upload(input, invalidFile)

    expect(screen.getByText(/invalid file type/i)).toBeInTheDocument()

    // Upload valid file
    const validFile = new File(['video'], 'test.mp4', { type: 'video/mp4' })

    const mockVideo = document.createElement('video')
    Object.defineProperty(mockVideo, 'duration', { value: 60 })
    Object.defineProperty(mockVideo, 'videoWidth', { value: 1280 })
    Object.defineProperty(mockVideo, 'videoHeight', { value: 720 })

    const createElementSpy = jest.spyOn(document, 'createElement')
    createElementSpy.mockImplementation((tag: string) => {
      if (tag === 'video') {
        setTimeout(() => {
          mockVideo.onloadedmetadata?.({} as Event)
        }, 0)
        return mockVideo
      }
      return document.createElement(tag)
    })

    await user.upload(input, validFile)

    await waitFor(() => {
      expect(screen.queryByText(/invalid file type/i)).not.toBeInTheDocument()
    })

    createElementSpy.mockRestore()
  })
})
