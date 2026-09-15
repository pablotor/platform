import introduction from '../../../../docs/intro.md';
import ROUTES from '../../common/routes';
import MarkdownFormatter from '../../components/markdownFormatter';
import Paginator from './components/paginator';

const DocPage = async () => (
  <div className="flex flex-col min-h-full justify-between max-w-3xl py-12 mx-auto">
    <article>
      <MarkdownFormatter variant="documentation">
        {introduction}
      </MarkdownFormatter>
    </article>
    <Paginator
      next={{
        label: 'Getting started',
        href: ROUTES.public.docs.gettingStarted,
      }}
      className="px-10"
    />
  </div>
);

export default DocPage;
