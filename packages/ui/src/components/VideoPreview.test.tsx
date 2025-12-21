import {
  describe,
  it,
  expect,
  jest,
  beforeEach,
  afterEach,
} from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VideoPreview } from './VideoPreview'
import type { VideoMetadata } from '../utils/fileUtils'

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockObjectURL = 'blob:mock-url'
const createObjectURLMock = jest.fn(() => mockObjectURL)
const revokeObjectURLMock = jest.fn()

beforeEach(() => {
  global.URL.createObjectURL =
    createObjectURLMock as unknown as typeof URL.createObjectURL
  global.URL.revokeObjectURL =
    revokeObjectURLMock as unknown as typeof URL.revokeObjectURL
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('VideoPreview', () => {
  const mockFile = new File(['video content'], 'test-video.mp4', {
    type: 'video/mp4',
  })

  const mockMetadata: VideoMetadata = {
    duration: 125, // 2:05
    width: 1920,
    height: 1080,
    format: 'video/mp4',
    size: 10485760, // 10 MB
  }

  it('renders video preview with correct title', () => {
    const onRemove = jest.fn()
    render(
      <VideoPreview
        file={mockFile}
        metadata={mockMetadata}
        onRemove={onRemove}
      />
    )

    expect(screen.getByText('Video Preview')).toBeInTheDocument()
  })

  it('creates object URL for video', () => {
    const onRemove = jest.fn()
    render(
      <VideoPreview
        file={mockFile}
        metadata={mockMetadata}
        onRemove={onRemove}
      />
    )

    expect(createObjectURLMock).toHaveBeenCalledWith(mockFile)
  })

  it('displays video player with correct source', () => {
    const onRemove = jest.fn()
    render(
      <VideoPreview
        file={mockFile}
        metadata={mockMetadata}
        onRemove={onRemove}
      />
    )

    const video = screen.getByTestId('video-preview-player') as HTMLVideoElement
    expect(video).toBeInTheDocument()
    expect(video.src).toBe(mockObjectURL)
    expect(video).toHaveAttribute('controls')
  })

  it('displays file name', () => {
    const onRemove = jest.fn()
    render(
      <VideoPreview
        file={mockFile}
        metadata={mockMetadata}
        onRemove={onRemove}
      />
    )

    expect(screen.getByText('test-video.mp4')).toBeInTheDocument()
  })

  it('displays formatted file size', () => {
    const onRemove = jest.fn()
    render(
      <VideoPreview
        file={mockFile}
        metadata={mockMetadata}
        onRemove={onRemove}
      />
    )

    expect(screen.getByText('10 MB')).toBeInTheDocument()
  })

  it('displays formatted duration', () => {
    const onRemove = jest.fn()
    render(
      <VideoPreview
        file={mockFile}
        metadata={mockMetadata}
        onRemove={onRemove}
      />
    )

    expect(screen.getByText('2:05')).toBeInTheDocument()
  })

  it('displays resolution', () => {
    const onRemove = jest.fn()
    render(
      <VideoPreview
        file={mockFile}
        metadata={mockMetadata}
        onRemove={onRemove}
      />
    )

    expect(screen.getByText('1920 × 1080')).toBeInTheDocument()
  })

  it('calls onRemove when remove button is clicked', async () => {
    const user = userEvent.setup()
    const onRemove = jest.fn()
    render(
      <VideoPreview
        file={mockFile}
        metadata={mockMetadata}
        onRemove={onRemove}
      />
    )

    const removeButton = screen.getByRole('button', { name: /remove video/i })
    await user.click(removeButton)

    expect(onRemove).toHaveBeenCalledTimes(1)
  })

  it('revokes object URL on unmount', () => {
    const onRemove = jest.fn()
    const { unmount } = render(
      <VideoPreview
        file={mockFile}
        metadata={mockMetadata}
        onRemove={onRemove}
      />
    )

    unmount()

    expect(revokeObjectURLMock).toHaveBeenCalledWith(mockObjectURL)
  })

  it('handles long file names with truncation', () => {
    const longFile = new File(
      ['content'],
      'very-long-file-name-that-should-be-truncated.mp4',
      {
        type: 'video/mp4',
      }
    )
    const onRemove = jest.fn()
    render(
      <VideoPreview
        file={longFile}
        metadata={mockMetadata}
        onRemove={onRemove}
      />
    )

    const fileNameElement = screen.getByText(/very-long-file-name/)
    expect(fileNameElement).toHaveClass('truncate')
    expect(fileNameElement).toHaveAttribute('title', longFile.name)
  })
})
