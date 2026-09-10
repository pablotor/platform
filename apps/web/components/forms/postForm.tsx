import { CreatePostPayload, UpdatePostPayload } from '@repo/contracts';
import Button from '@repo/ui/button';
import Input from '@repo/ui/input';
import Textarea from '@repo/ui/textarea';

import useForm from '../../hooks/useForm';
import CategorySelect from '../inputs/categorySelect';
import ContentFormWrapper from './contentFormWrapper';

type PostFormProps<
  T extends Record<string, unknown> = CreatePostPayload | UpdatePostPayload,
> = Pick<
  ReturnType<typeof useForm<T>>,
  'register' | 'registerForm' | 'isSubmitting'
> & {
  title: string;
  submitLabel: string;
  submitingLabel: string;
};

const PostForm = ({
  registerForm,
  register,
  isSubmitting,
  title,
  submitLabel,
  submitingLabel,
}: PostFormProps) => (
  <form {...registerForm()} className="flex flex-1 flex-col gap-6">
    <div className="flex items-center justify-between gap-4">
      <h1 className="text-heading">{title}</h1>
      <Button variant="default" type="submit" disabled={isSubmitting}>
        {isSubmitting ? submitingLabel : submitLabel}
      </Button>
    </div>
    {/* Content Section */}
    <h3 id="content" className="text-subheading">
      Content
    </h3>
    <Input label="Title" {...register('title')} />
    <ContentFormWrapper label="Content" {...register('content')} />

    {/* Details Section */}
    <h3 id="details" className="text-subheading mt-6">
      Details
    </h3>
    <Textarea label="Excerpt" {...register('excerpt')} />
    <Input label="Kicker" {...register('kicker')} />
    <Input label="Slug" {...register('slug')} />

    {/* Metadata Section */}
    <h3 id="metadata" className="text-subheading mt-6">
      Metadata
    </h3>
    <CategorySelect label="Category" {...register('category')} />
    <Input label="SEO Title" {...register('seoTitle')} />
    <Textarea label="SEO Description" {...register('seoDescription')} />
  </form>
);

export default PostForm;
