'use client';

import React, { useEffect, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { patientActivityTags } from '../../../constants';
import { patientNoteFormValidationSchema } from '../../../schemas';
import MoodScoreSlider from '../../molecules/MoodScoreSlider/MoodScoreSlider';
import Select from '../../molecules/Select/Select';
import TextArea from '../../molecules/TextArea/TextArea';
import TextInput from '../../molecules/TextInput/TextInput';

type PatientNoteFormValues = zod.infer<typeof patientNoteFormValidationSchema>;

type PatientNoteFormProps = {
  formId: string;
  note: Entity.PatientNote | null;
  externalErrorMessage: string | null;
  onSubmit: (input: Entity.PatientNoteMutationInput) => Promise<void>;
};

function createDefaultValues(note: Entity.PatientNote | null): PatientNoteFormValues {
  return {
    moodLabel: note?.moodLabel ?? '',
    moodScore: note?.moodScore ?? 5,
    activityTags: note?.activityTags ?? [],
    summaryText: note?.summaryText ?? '',
  };
}

function mapFormValuesToInput(values: PatientNoteFormValues): Entity.PatientNoteMutationInput {
  return {
    moodLabel: values.moodLabel || null,
    moodScore: values.moodScore,
    activityTags: values.activityTags,
    summaryText: values.summaryText.trim(),
  };
}

export default React.memo(function PatientNoteForm({
  formId,
  note,
  externalErrorMessage,
  onSubmit,
}: PatientNoteFormProps) {
  const activityTagOptions = useMemo(
    () => patientActivityTags.map((activityTag) => ({ label: activityTag, value: activityTag })),
    [],
  );
  const { control, handleSubmit, reset } = useForm<PatientNoteFormValues>({
    defaultValues: createDefaultValues(note),
    resolver: zodResolver(patientNoteFormValidationSchema),
    mode: 'onSubmit',
  });

  useEffect(() => {
    reset(createDefaultValues(note));
  }, [note, reset]);

  const submitForm = handleSubmit(async (values) => {
    await onSubmit(mapFormValuesToInput(values));
  });

  return (
    <form id={formId} onSubmit={(event) => void submitForm(event)} className="contents">
      <Controller
        control={control}
        name="moodLabel"
        render={({ field, fieldState }) => (
          <TextInput
            value={field.value}
            onChange={field.onChange}
            label="Mood label"
            placeholder="e.g. Many works"
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="moodScore"
        render={({ field, fieldState }) => (
          <MoodScoreSlider
            value={field.value}
            onChange={field.onChange}
            label="Mood score"
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="summaryText"
        render={({ field, fieldState }) => (
          <TextArea value={field.value} onChange={field.onChange} label="Summary" rows={5} placeholder="Short note shown in the card" errorMessage={fieldState.error?.message} />
        )}
      />

      <Controller
        control={control}
        name="activityTags"
        render={({ field, fieldState }) => (
          <Select
            value={field.value}
            onChange={(nextValue) => field.onChange(nextValue)}
            options={activityTagOptions}
            label="Tags"
            multiple
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      {externalErrorMessage && <p className="text-sm font-medium text-calm-error">{externalErrorMessage}</p>}
    </form>
  );
});
