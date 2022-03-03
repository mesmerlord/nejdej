import {
  TextInput,
  Checkbox,
  Button,
  NumberInput,
  Select,
  Group,
  Text,
  Image,
  Container,
  Notification,
} from '@mantine/core';
import { useForm } from '@mantine/hooks';
import DropImage from 'components/listingsAdd/DropImage';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { trpc } from 'utils/trpc';
import { InferMutationInput } from 'utils/trpc-helper';
import { useNotifications } from '@mantine/notifications';

type AddListingFormValues = InferMutationInput<'listing.add'>;
type ReturnedPhotoUrl = {
  name: string;
  url: string;
  thumbnailUrl: string;
};
const AddListing = () => {
  const router = useRouter();
  const { locale } = router;
  const [selectedFiles, setSelectedFiles] = useState<ReturnedPhotoUrl[]>([]);
  const notifications = useNotifications();

  const [availableSubcategories, setAvailableSubcategories] = useState<
    any[] | null
  >(null);
  const [subCategorySelected, setSubCategorySelected] = useState<
    string | null
  >();
  const initial_values: AddListingFormValues = {
    title: '',
    description: '',
    price: 0,
    subCategory: undefined,
  };
  const form = useForm({
    initialValues: initial_values,
  });
  const mutation = trpc.useMutation(['listing.add'], {
    onSuccess: () => {
      notifications.showNotification({
        title: 'Listing added',
        message: 'Hey there, your listing is now visible',
      });
    },
  });

  const subcategoriesQuery = trpc.useQuery(
    ['subCategory.allWithCategory', { locale }],
    {
      refetchOnWindowFocus: false,
    },
  );

  const createAd = (values: AddListingFormValues) => {
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
    if (subCategorySelected) {
      form.setFieldValue('subCategory', subCategorySelected);
    }
  }, [subCategorySelected]);
  return (
    <Container>
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
        <DropImage
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Container>
  );
};
export default AddListing;
