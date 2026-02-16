'use client';

import { useState } from 'react';
import SkillBookList from './SkillBookList';
import SkillBookEditor from './SkillBookEditor';

type SkillBookManagerProps = {
  autoCreate?: boolean;
};

type Mode = { view: 'list' } | { view: 'editor'; editingId: string | null };

export default function SkillBookManager({ autoCreate = false }: SkillBookManagerProps) {
  const [mode, setMode] = useState<Mode>(
    autoCreate ? { view: 'editor', editingId: null } : { view: 'list' },
  );

  if (mode.view === 'editor') {
    return (
      <SkillBookEditor
        editingId={mode.editingId}
        onDone={() => setMode({ view: 'list' })}
      />
    );
  }

  return (
    <SkillBookList
      onEdit={(id) => setMode({ view: 'editor', editingId: id })}
      onNew={() => setMode({ view: 'editor', editingId: null })}
    />
  );
}
