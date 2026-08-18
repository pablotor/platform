import '@repo/ui/tiptap.css';

import CreatePostForm from './components/createPostForm';

const DashboardPostsPage = async () => (
  <div className="mx-auto flex h-full flex-col gap-6 px-6 md:px-24 py-10">
    <CreatePostForm />
  </div>
);

export default DashboardPostsPage;
