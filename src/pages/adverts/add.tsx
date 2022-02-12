import { TextInput, Checkbox, Button } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { trpc } from 'utils/trpc';

export type AddAdvertFormValues = {
  title: string;
  description: string;
};
const AddAdvert = () => {
  const form = useForm({
    initialValues: {
      title: '',
      description: '',
    },
  });
  const mutation = trpc.useMutation(['advert.add']);

  const createAd = (values: AddAdvertFormValues) => {
    mutation.mutate(values);
  };

  return (
    <form onSubmit={form.onSubmit((values) => createAd(values))}>
      <TextInput
        required
        label="Description"
        {...form.getInputProps('description')}
      />
      <TextInput required label="Title" {...form.getInputProps('title')} />

      <Button type="submit">Submit</Button>
    </form>
  );
};
export default AddAdvert;
