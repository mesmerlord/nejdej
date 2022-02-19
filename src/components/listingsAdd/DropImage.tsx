import { Group, Image, Text, useMantineTheme, Container } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import axios from 'axios';
import { useState } from 'react';
import { trpc } from 'utils/trpc';
import { ImageIcon, UploadIcon, CrossCircledIcon } from '@radix-ui/react-icons';

type ReturnedPhotoUrl = {
  name: string;
  url: string;
  thumbnailUrl: string;
};
type AllowedImages =
  | 'image/png'
  | 'image/jpeg'
  | 'image/sgv+xml'
  | 'image/gif'
  | 'image/webp';
export interface DropImageProps {
  selectedFiles: ReturnedPhotoUrl[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<ReturnedPhotoUrl[]>>;
}

function ImageUploadIcon({ status, ...props }) {
  if (status.accepted) {
    return <UploadIcon {...props} />;
  }

  if (status.rejected) {
    return <CrossCircledIcon {...props} />;
  }

  return <ImageIcon {...props} />;
}

function getIconColor(status, theme) {
  return status.accepted
    ? theme.colors[theme.primaryColor][6]
    : status.rejected
    ? theme.colors.red[6]
    : theme.colorScheme === 'dark'
    ? theme.colors.dark[0]
    : theme.black;
}

const DropImage = ({ selectedFiles, setSelectedFiles }: DropImageProps) => {
  const [addedFiles, setAddedFiles] = useState<{}>({});
  const theme = useMantineTheme();

  const addPhotoMutation = trpc.useMutation(['photos.uploadFile'], {
    onSettled: (data) => {
      if (data) {
        const { signedUrl, fileName, originalName, thumbnailUrl, url } = data;
        const reader = new FileReader();

        const file = addedFiles[originalName].file;
        reader.onload = () => {
          const result = reader.result;
          axios
            .put(signedUrl, file, {
              headers: {
                'Content-Type': file.type,
              },
            })
            .then((data) => {
              let newSelectedFiles: any = {
                name: file.name,
                thumbnailUrl,
                url,
              };
              setSelectedFiles((oldArray) => [...oldArray, newSelectedFiles]);
            })
            .catch((err) => {
              console.log(err?.response, err?.response?.data?.message);
            });
        };
        reader.onerror = () => {
          console.error(`Error occurred reading file: ${originalName}`);
        };
        reader.readAsArrayBuffer(file);
      }
    },
  });
  const addFile = (files: File[]) => {
    files.map((file) => {
      const fileName = file.name;
      if (!addedFiles[fileName]) {
        let addedFile = {};
        addedFile[fileName] = { file, fileType: file.type as AllowedImages };
        setAddedFiles({ ...addedFile, ...addedFiles });
        addPhotoMutation.mutate({
          fileType: file.type as AllowedImages,
          name: file.name,
        });
      }
    });
  };
  return (
    <>
      <Container>
        <Dropzone
          onDrop={addFile}
          onReject={(files) => console.log('rejected files', files)}
          maxSize={3 * 1024 ** 2}
          accept={[
            'image/png',
            'image/jpeg',
            'image/sgv+xml',
            'image/gif',
            'image/webp',
          ]}
          loading={addPhotoMutation?.isLoading}
        >
          {(status) => (
            <Group
              position="center"
              spacing="xl"
              style={{ minHeight: 220, pointerEvents: 'none' }}
            >
              <ImageUploadIcon
                status={status}
                style={{
                  width: 80,
                  height: 80,
                  color: getIconColor(status, theme),
                }}
              />

              <div>
                <Text size="xl" inline>
                  Drag images here or click to select files
                </Text>
                <Text size="sm" color="dimmed" inline mt={7}>
                  Attach as many files as you like, each file should not exceed
                  5mb
                </Text>
              </div>
            </Group>
          )}
        </Dropzone>
      </Container>
      <Group>
        {selectedFiles.map((file) => (
          <Image width={100} key={file.name} src={file.thumbnailUrl} />
        ))}
      </Group>
    </>
  );
};
export default DropImage;
