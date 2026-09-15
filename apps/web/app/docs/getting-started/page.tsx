import gettingStarted from '../../../../../docs/getting-started.md';
import ROUTES from '../../../common/routes';
import MarkdownFormatter from '../../../components/markdownFormatter';
import Paginator from '../components/paginator';

const DocPage = async () => (
  <div className="flex flex-col min-h-full justify-between max-w-3xl gap-12 py-12 mx-auto">
    <article>
      <MarkdownFormatter variant="documentation">
        {gettingStarted}
      </MarkdownFormatter>
    </article>
    <Paginator
      prev={{
        label: 'Introduction',
        href: ROUTES.public.docs.root,
      }}
      next={{
        label: 'Project structure',
        href: ROUTES.public.docs.projectStructure,
      }}
      className="px-10"
    />
  </div>
);

export default DocPage;
