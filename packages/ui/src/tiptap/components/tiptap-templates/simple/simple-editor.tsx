'use client';

import { Highlight } from '@tiptap/extension-highlight';
import { Image } from '@tiptap/extension-image';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { TextAlign } from '@tiptap/extension-text-align';
import { Typography } from '@tiptap/extension-typography';
import { Selection } from '@tiptap/extensions';
import { Markdown } from '@tiptap/markdown';
import { EditorContent, EditorContext, useEditor } from '@tiptap/react';
// --- Tiptap Core Extensions ---
import { StarterKit } from '@tiptap/starter-kit';
import { type ReactNode, useEffect, useRef, useState } from 'react';

// --- Hooks ---
import { useCursorVisibility } from '../../../hooks/use-cursor-visibility';
import { useIsBreakpoint } from '../../../hooks/use-is-breakpoint';
import { useWindowSize } from '../../../hooks/use-window-size';
// --- Icons ---
import { ArrowLeftIcon } from '../../tiptap-icons/arrow-left-icon';
import { HighlighterIcon } from '../../tiptap-icons/highlighter-icon';
import { LinkIcon } from '../../tiptap-icons/link-icon';
import { HorizontalRule } from '../../tiptap-node/horizontal-rule-node/horizontal-rule-node-extension';
// --- Components ---
import { BlockquoteButton } from '../../tiptap-ui/blockquote-button';
import { CodeBlockButton } from '../../tiptap-ui/code-block-button';
import {
  ColorHighlightPopover,
  ColorHighlightPopoverButton,
  ColorHighlightPopoverContent,
} from '../../tiptap-ui/color-highlight-popover';
// --- Tiptap UI ---
import { HeadingDropdownMenu } from '../../tiptap-ui/heading-dropdown-menu';
import {
  LinkButton,
  LinkContent,
  LinkPopover,
} from '../../tiptap-ui/link-popover';
import { ListDropdownMenu } from '../../tiptap-ui/list-dropdown-menu';
import { MarkButton } from '../../tiptap-ui/mark-button';
import { UndoRedoButton } from '../../tiptap-ui/undo-redo-button';
// --- UI Primitives ---
import { Button } from '../../tiptap-ui-primitive/button';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from '../../tiptap-ui-primitive/toolbar';
import mdContent from './data/mdContent';

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
}: {
  onHighlighterClick: () => void;
  onLinkClick: () => void;
  isMobile: boolean;
}) => {
  return (
    <>
      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu modal={false} levels={[1, 2, 3, 4]} />
        <ListDropdownMenu
          modal={false}
          types={['bulletList', 'orderedList', 'taskList']}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>
    </>
  );
};

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: 'highlighter' | 'link';
  onBack: () => void;
}) => (
  <>
    <ToolbarGroup>
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === 'highlighter' ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === 'highlighter' ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
);

type SimpleEditorProps = {
  /** Field label, rendered above the editor like Input's label. */
  label?: string | ReactNode;
  /** Whether to reserve/show space for the error text below the editor. */
  showErrorText?: boolean;
  /**
   * Field name. When provided, a hidden <input> mirroring the markdown
   * content is rendered under this name so it's picked up by FormData
   * on native form submission (uncontrolled, like every other field
   * produced by useForm's `register`).
   */
  name?: string;
  /** Initial markdown content. Mirrors `register`'s `defaultValue`. */
  defaultValue?: string;
  /** Fired on editor blur, receiving a synthetic-ish event shape
   * compatible with `register`'s onBlur (reads `event.target.value`). */
  onBlur?: (event: { target: { value: string } }) => void;
  /** Fired on every content change with the current markdown string. */
  onChange?: (markdown: string) => void;
  /** Validation error message, surfaced under the editor. */
  error?: string;
  /** Optional id, defaults to `name`. */
  id?: string;
};

export const SimpleEditor = ({
  label,
  showErrorText,
  name,
  defaultValue,
  onBlur,
  onChange,
  error,
  id,
}: SimpleEditorProps) => {
  const isMobile = useIsBreakpoint();
  const { height } = useWindowSize();
  const [mobileView, setMobileView] = useState<'main' | 'highlighter' | 'link'>(
    'main',
  );
  const toolbarRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        'aria-label': 'Main content area, start typing to enter text.',
        class: 'simple-editor',
      },
    },
    extensions: [
      Markdown,
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
    ],
    content: defaultValue ?? mdContent,
    contentType: 'markdown',
    onUpdate: ({ editor: currentEditor }) => {
      const markdown = currentEditor.getMarkdown();
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = markdown;
      }
      onChange?.(markdown);
    },
    onBlur: ({ editor: currentEditor }) =>
      onBlur?.({ target: { value: currentEditor.getMarkdown() } }),
  });

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  });

  useEffect(() => {
    if (!isMobile && mobileView !== 'main') {
      setMobileView('main');
    }
  }, [isMobile, mobileView]);

  return (
    <div className="max-h-full flex flex-1 flex-col gap-2">
      {label ? (
        <label htmlFor={id ?? name} className="mb-2 block text-label">
          {label}
        </label>
      ) : null}

      <div
        className="
          h-64 max-h-full flex flex-col rounded-lg border border-input shadow-sm
          aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20
          focus-within:focusable transition-[color,box-shadow]
        "
        aria-invalid={!!error}
      >
        <div className="flex flex-col h-full min-h-0 overflow-hidden rounded-lg">
          <EditorContext.Provider value={{ editor }}>
            <Toolbar
              ref={toolbarRef}
              style={{
                ...(isMobile
                  ? {
                      bottom: `calc(100% - ${height - rect.y}px)`,
                    }
                  : {}),
              }}
            >
              {mobileView === 'main' ? (
                <MainToolbarContent
                  onHighlighterClick={() => setMobileView('highlighter')}
                  onLinkClick={() => setMobileView('link')}
                  isMobile={isMobile}
                />
              ) : (
                <MobileToolbarContent
                  type={mobileView === 'highlighter' ? 'highlighter' : 'link'}
                  onBack={() => setMobileView('main')}
                />
              )}
            </Toolbar>

            <div className="simple-editor-wrapper">
              <EditorContent
                editor={editor}
                role="presentation"
                className="simple-editor-content"
              />
            </div>
          </EditorContext.Provider>
        </div>
        {name ? (
          <input
            ref={hiddenInputRef}
            type="hidden"
            id={id ?? name}
            name={name}
          />
        ) : null}
      </div>

      {showErrorText && (
        <div className="min-h-4 mt-2 text-overline">
          {error && <p className="text-destructive text-xs">{error}</p>}
        </div>
      )}
    </div>
  );
};
