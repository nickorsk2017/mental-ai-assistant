'use client';

import React, { useMemo, useState } from 'react';

import { usePatientNotesGrouping } from '../../../hooks';
import { Button } from '../../atoms/Button/Button';
import Collapse from '../../molecules/Collapse/Collapse';
import PanelPageHeader from '../../molecules/PanelPageHeader/PanelPageHeader';

import PatientNoteCard from './components/PatientNoteCard';
import PatientNotesLegends from './components/PatientNotesLegends';

const allTagsValue = 'all';

interface PatientNotesWorkspaceProperties {
  title: string;
  notes: Entity.PatientNote[];
  isLoading: boolean;
  emptyStateMessage: string;
  onCreateNote?: () => void;
  onEditNote?: (note: Entity.PatientNote) => void;
  onDeleteNote?: (noteId: string) => void;
}

export default React.memo(function PatientNotesWorkspace({
  title,
  notes,
  isLoading,
  emptyStateMessage,
  onCreateNote,
  onEditNote,
  onDeleteNote,
}: PatientNotesWorkspaceProperties) {
  const { collectPatientNoteTags, groupPatientNotes } = usePatientNotesGrouping();
  const [selectedTag, setSelectedTag] = useState(allTagsValue);
  const availableTags = useMemo(() => collectPatientNoteTags(notes), [notes, collectPatientNoteTags]);
  const filteredNotes = useMemo(
    () => notes.filter((note) => selectedTag === allTagsValue || note.activityTags.includes(selectedTag)),
    [notes, selectedTag],
  );
  const groupedNotes = useMemo<Entity.PatientNoteGroup[]>(
    () => groupPatientNotes(filteredNotes),
    [filteredNotes, groupPatientNotes],
  );

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-calm-surface">
      {onCreateNote ? (
        <PanelPageHeader
          title={title}
          onPrimaryAction={onCreateNote}
          primaryActionAriaLabel="Create note"
        />
      ) : (
        <PanelPageHeader title={title} />
      )}

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
        <div className="mx-auto flex w-full max-w-[56rem] flex-col gap-5">
          <div className="pt-6">
            <div className="flex flex-col gap-5">
              <PatientNotesLegends />
              <div className="flex flex-wrap gap-2">
                {[allTagsValue, ...availableTags].map((tag) => (
                  <Button
                    key={tag}
                    type="button"
                    wide={false}
                    size="small"
                    rounded
                    variant={selectedTag === tag ? 'black' : 'outline'}
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag === allTagsValue ? 'All' : tag}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {isLoading ? <p className="py-16 text-center text-sm text-calm-muted">Loading notes...</p> : null}
          {!isLoading && groupedNotes.length === 0 ? (
            <p className="rounded-lg border border-calm-border/50 bg-calm-surface/70 px-6 py-10 text-center text-sm text-calm-muted shadow-subtle">
              {emptyStateMessage}
            </p>
          ) : null}

          <div className="flex flex-col gap-10">
            {groupedNotes.map((group) => (
              <Collapse
                key={group.label}
                defaultOpen={group.label === 'Today'}
                header={<span className="text-sm font-semibold text-calm-muted">{group.label}</span>}
              >
                <div className="flex flex-col gap-6">
                  {group.notes.map((note) => (
                    <PatientNoteCard
                      key={note.id}
                      note={note}
                      onEdit={onEditNote}
                      onDelete={onDeleteNote}
                    />
                  ))}
                </div>
              </Collapse>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
