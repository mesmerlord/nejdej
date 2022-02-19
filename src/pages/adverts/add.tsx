import {
  TextInput,
  Checkbox,
  Button,
  NumberInput,
  Select,
  Group,
  Text,
  Image,
} from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { trpc } from 'utils/trpc';
import { InferMutationInput } from 'utils/trpc-helper';
import { Dropzone } from '@mantine/dropzone';
import axios from 'axios';

type AddAdvertFormValues = InferMutationInput<'advert.add'>;
type Subcategory = InferMutationInput<'advert.add'>;
type ReturnedPhotoUrl = {
  name?: string;
  url: string;
  thumbnailUrl: string;
};
type AllowedImages =
  | 'image/png'
  | 'image/jpeg'
  | 'image/sgv+xml'
  | 'image/gif'
  | 'image/webp';
const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

const apiRoute = '/api/upload/images';
const AddAdvert = () => {
  const router = useRouter();
  const { locale } = router;
  const [selectedFiles, setSelectedFiles] = useState<ReturnedPhotoUrl[]>([]);
  const [addedFiles, setAddedFiles] = useState<{}>({});
  const [availableSubcategories, setAvailableSubcategories] = useState<
    any[] | null
  >(null);
  const [subCategorySelected, setSubCategorySelected] = useState<
    string | null
  >();
  const initial_values: AddAdvertFormValues = {
    title: '',
    description: '',
    price: 0,
    subCategory: undefined,
  };
  const form = useForm({
    initialValues: initial_values,
  });
  const mutation = trpc.useMutation(['advert.add']);
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

  const subcategoriesQuery = trpc.useQuery(
    ['subCategory.allWithCategory', { locale }],
    { refetchOnWindowFocus: false },
  );

  const createAd = (values: AddAdvertFormValues) => {
    const photos = selectedFiles.map((selectedFile) => {
      return { name: selectedFile.name, url: selectedFile.url };
    });
    const allValues = {
      photos,
      subCategory: subCategorySelected ?? undefined,
      ...values,
    };
    mutation.mutate(allValues);
  };

  const getSubCategories = (value) => {
    if (subcategoriesQuery?.data) {
      const subCategories = subcategoriesQuery?.data?.filter(
        (category) => category.id === value,
      );
      setAvailableSubcategories(subCategories[0].subCategory);
    }
  };
  useEffect(() => {
    console.log(selectedFiles);
  }, [selectedFiles]);

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

  useEffect(() => {}, [addedFiles]);
  useEffect(() => {
    if (subCategorySelected) {
      form.setFieldValue('subCategory', subCategorySelected);
    }
  }, [subCategorySelected]);
  return (
    <form onSubmit={form.onSubmit((values) => createAd(values))}>
      <TextInput
        required
        label="Description"
        {...form.getInputProps('description')}
      />
      <TextInput required label="Title" {...form.getInputProps('title')} />
      <NumberInput required label="Price" {...form.getInputProps('price')} />
      <Select
        label="Your category first"
        placeholder="Pick one"
        data={
          subcategoriesQuery?.data?.map((category) => {
            return {
              value: category.id,
              label: locale === 'en' ? category.enTitle : category.skTitle,
            };
          }) || []
        }
        onChange={getSubCategories}
      />
      <Select
        label="Select a subcategory"
        placeholder="Pick one"
        data={
          availableSubcategories?.map((subCategory) => {
            return {
              value: subCategory.id,
              label:
                locale === 'en' ? subCategory.enTitle : subCategory.skTitle,
            };
          }) || []
        }
        value={subCategorySelected}
        onChange={setSubCategorySelected}
      />
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
        {(status) => <Text>Done</Text>}
      </Dropzone>
      <Group>
        {selectedFiles.map((file) => (
          <Image width={100} key={file.name} src={file.thumbnailUrl} />
        ))}
      </Group>
      <Button type="submit">Submit</Button>
    </form>
  );
};
export default AddAdvert;
