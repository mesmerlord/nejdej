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

type AddAdvertFormValues = InferMutationInput<'advert.add'>;
type Subcategory = InferMutationInput<'advert.add'>;
type ReturnedPhotoUrl = {
  name?: string;
  url: string;
  thumbnailUrl: string;
  id: string;
};

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
  const addPhotoMutation = trpc.useMutation(['photos.uploadFile']);

  const subcategoriesQuery = trpc.useQuery(
    ['subCategory.allWithCategory', { locale }],
    { refetchOnWindowFocus: false },
  );

  const createAd = (values: AddAdvertFormValues) => {
    const photos = selectedFiles.map((selectedFile) => selectedFile.id);
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

  const addFile = async (files: File[]) => {
    const notUploaded = files.filter((file) => {
      const filesNotUploaded = selectedFiles.filter(
        (selectedFile) => selectedFile.name === file.name,
      );
      return filesNotUploaded;
    });
    notUploaded.map(async (file) => {
      const fileName = file.name;

      if (fileName) {
        const base64: any = await convertBase64(file);
        addPhotoMutation.mutate({
          fileEncoded: base64.toString() as string,
          name: fileName,
        });
      }
    });
  };
  useEffect(() => {
    console.log(addPhotoMutation.data);

    if (addPhotoMutation.data) {
      const { url, name, id } = addPhotoMutation.data;
      const file: ReturnedPhotoUrl = {
        name: name ?? undefined,
        url,
        thumbnailUrl: `${url}?tr=h-150&w-150`,
        id,
      };
      if (!selectedFiles.includes(file)) {
        setSelectedFiles([file, ...selectedFiles]);
      }
      console.log(selectedFiles);
    }
  }, [addPhotoMutation.data]);

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
          <Image width={100} src={file.thumbnailUrl} />
        ))}
      </Group>
      <Button type="submit">Submit</Button>
    </form>
  );
};
export default AddAdvert;
