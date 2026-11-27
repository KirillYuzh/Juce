import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileUpload } from './FileUpload';

const UPLOAD_SOURCE = `const [files, setFiles] = useState<File[]>([]);

<FileUpload
  accept=".pdf,.docx,.png"
  maxSize={10 * 1024 * 1024}
  multiple
  value={files}
  onFiles={(next) => setFiles((current) => [...current, ...next])}
  onRemove={(file) => setFiles((current) => current.filter((item) => item !== file))}
/>`;

const meta: Meta = {
  title: 'Primitives/File upload',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

function FileUploadExample() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div style={{ width: 480 }}>
      <FileUpload
        accept=".pdf,.docx,.png"
        maxSize={10 * 1024 * 1024}
        multiple
        value={files}
        onFiles={(next) => setFiles((current) => [...current, ...next])}
        onRemove={(file) => setFiles((current) => current.filter((item) => item !== file))}
      />
    </div>
  );
}

export const Upload: Story = {
  render: () => <FileUploadExample />,
  parameters: { docs: { source: { code: UPLOAD_SOURCE } } },
};
