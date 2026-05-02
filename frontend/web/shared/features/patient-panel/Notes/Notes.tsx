'use client';

import React, { useEffect, useMemo, useState } from 'react';

import { usePatientNotesGrouping } from '@common/shared/hooks';
import { loadPatientNotes } from '@common/shared/services';

import Legends from './components/Legends/Legends';
import NoteCard from './components/NoteCard/NoteCard';

const allTagsValue = 'all';

const Notes = React.memo(function Notes() {
  const { collectPatientNoteTags, groupPatientNotes } = usePatientNotesGrouping();

  const [notes, setNotes] = useState<Entity.PatientNote[]>([]);
  const [selectedTag, setSelectedTag] = useState(allTagsValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    void loadPatientNotes().then((loadedNotes) => {
      if (isMounted) {
        setNotes(loadedNotes);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const availableTags = useMemo(
    () => collectPatientNoteTags(notes),
    [notes, collectPatientNoteTags],
  );
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
      <header className="shrink-0 border-b border-calm-border/45 px-6 py-4 backdrop-blur-sm">
        <h1 className="text-base font-semibold text-calm-text">My notes</h1>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto flex w-full max-w-[56rem] flex-col gap-5">
          <Legends />

          <div className="flex flex-wrap gap-2">
            {[allTagsValue, ...availableTags].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`rounded-full border px-4 py-2 text-sm font-medium ${
                  selectedTag === tag
                    ? 'border-calm-second/40 bg-calm-second/15 text-calm-text'
                    : 'border-calm-border/55 bg-calm-surface/80 text-calm-muted'
                }`}
              >
                {tag === allTagsValue ? 'All' : tag}
              </button>
            ))}
          </div>

          {isLoading && <p className="py-16 text-center text-sm text-calm-muted">Loading notes...</p>}

          {!isLoading && groupedNotes.length === 0 && (
            <p className="rounded-lg border border-calm-border/50 bg-calm-surface/70 px-6 py-10 text-center text-sm text-calm-muted shadow-subtle">
              AI notes will appear here after Serene processes your chat messages.
            </p>
          )}

          {groupedNotes.map((group) => (
            <section key={group.label} className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-calm-muted">{group.label}</h2>
              {group.notes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
});

export default Notes;
