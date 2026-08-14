import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { DocumentUploadForm } from '@/components/erp/document-upload-form'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}))

describe('Document Upload Form', () => {
  it('renders correctly', () => {
    const { container } = render(<DocumentUploadForm />)
    expect(container).toBeTruthy()
  })
})
