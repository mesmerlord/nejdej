import {
  TextInput,
  Checkbox,
  Button,
  NumberInput,
  Select,
  Group,
  Text,
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
  const [selectedFile, setSelectedFile] = useState<File[]>();

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
    mutation.mutate(values);
  };

  const getSubCategories = (value) => {
    if (subcategoriesQuery?.data) {
      const subCategories = subcategoriesQuery?.data?.filter(
        (category) => category.id === value,
      );
      setAvailableSubcategories(subCategories[0].subCategory);
    }
  };

  const addFile = async (file: File) => {
    const fileName = file[0].name;
    const base64 = await convertBase64(file[0]);
    addPhotoMutation.mutate({
      fileEncoded: base64.toString() as string,
      name: fileName,
    });

    if (selectedFile) {
      setSelectedFile([file, ...selectedFile]);
    } else {
      setSelectedFile([file]);
    }
  };
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
        accept={['image/png', 'image/jpeg', 'image/sgv+xml', 'image/gif']}
      >
        {(status) => <Text>Done</Text>}
      </Dropzone>
      <Button type="submit">Submit</Button>
    </form>
  );
};
export default AddAdvert;
