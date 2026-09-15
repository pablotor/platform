import projectStructure from '../../../../../docs/project-structure.md';
import ROUTES from '../../../common/routes';
import MarkdownFormatter from '../../../components/markdownFormatter';
import Paginator from '../components/paginator';

const DocPage = async () => (
  <div className="flex flex-col min-h-full justify-between max-w-3xl gap-12 py-12 mx-auto">
    <article>
      <MarkdownFormatter variant="documentation">
        {projectStructure}
      </MarkdownFormatter>
    </article>
    <Paginator
      prev={{
        label: 'Getting started',
        href: ROUTES.public.docs.gettingStarted,
      }}
      className="px-10"
    />
  </div>
);

export default DocPage;
