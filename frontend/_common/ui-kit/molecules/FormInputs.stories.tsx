import type { Meta, StoryObj } from '@storybook/react';
import React, { useRef, useState } from 'react';

import MoodScoreSlider from './MoodScoreSlider/MoodScoreSlider';
import Select from './Select/Select';
import TextArea from './TextArea/TextArea';
import { sampleSelectOptions } from '../testing/UiKitFixtures';

const meta: Meta = {
  title: 'Molecules/Form Inputs',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type FormInputsStory = StoryObj;

export const SelectAndTextarea: FormInputsStory = {
  render: () => {
    const [selectValue, setSelectValue] = useState<string[]>(['work']);
    const [summaryText, setSummaryText] = useState('A quiet day with steady energy.');

    return (
      <div className="flex max-w-md flex-col gap-5">
        <Select
          value={selectValue}
          onChange={(nextValue) => setSelectValue(nextValue as string[])}
          options={sampleSelectOptions}
          label="Tags"
          multiple
        />
        <TextArea
          value={summaryText}
          onChange={setSummaryText}
          label="Summary"
          rows={4}
        />
      </div>
    );
  },
};

export const MoodScore: FormInputsStory = {
  render: () => {
    const [moodScore, setMoodScore] = useState(6);
    const textAreaReference = useRef<HTMLTextAreaElement | null>(null);

    return (
      <div className="flex max-w-md flex-col gap-5">
        <MoodScoreSlider value={moodScore} onChange={setMoodScore} />
        <TextArea
          value={`Current score: ${moodScore}/10`}
          onChange={() => undefined}
          label="Mood context"
          textareaReference={textAreaReference}
        />
      </div>
    );
  },
};
