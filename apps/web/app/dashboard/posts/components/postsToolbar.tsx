import OrderControl from './orderControl';
import ViewSwitcher from './viewSwitcher';

// Composes independent, self-contained tools. Each tool owns its own
// state/URL param. Adding a future tool (search, filters) means dropping in
// one more self-contained component here, not touching the others.
const PostsToolbar = () => (
  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3">
    <ViewSwitcher />
    <OrderControl />
  </div>
);

export default PostsToolbar;
