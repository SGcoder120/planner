import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { SemesterCode, SemesterType } from '@prisma/client';
import { FC, useMemo, useState } from 'react';

import { trpc } from '@/utils/trpc';
import {
  createSemesterCodeRange,
  displaySemesterCode,
  loadDummyCourses,
} from '@/utils/utilFunctions';

import useSearch from '../search/search';
import AutoCompleteSearchBar from './AutoCompleteSearchBar';
import Button from './Button';
import DropdownSelect from './DropdownSelect';
import { getStartingPlanSemester } from '@/utils/plannerUtils';

const Layout: FC = ({ children }) => <section className="flex flex-col gap-10">{children}</section>;

const CreditsForm: FC = () => {
  const [credit, setCredit] = useState<string | null>();
  const [isTransfer, setIsTransfer] = useState(false);

  const user = trpc.user.getUser.useQuery();

  const semesters = useMemo(
    () =>
      createSemesterCodeRange(
        user.data?.profile?.startSemester ?? { semester: 'f', year: 2022 },
        getStartingPlanSemester(),
        false,
      ),
    [],
  );

  const [semester, setSemester] = useState<SemesterCode>(semesters[0]);

  const utils = trpc.useContext();

  const addCredit = trpc.credits.addCredit.useMutation({
    async onSuccess() {
      await utils.credits.getCredits.invalidate();
    },
  });

  const { results, updateQuery } = useSearch({
    getData: loadDummyCourses,
    initialQuery: '',
    filterFn: (course, query) => course.code.toLowerCase().includes(query.toLowerCase()),
  });

  const submit = () => {
    if (credit) {
      addCredit.mutateAsync({
        courseCode: credit,
        semesterCode: semester,
        transfer: isTransfer,
      });
    }
  };

  return (
    <Layout>
      <h1 className="text-4xl font-semibold text-[#1C2A6D]">Add Credit</h1>

      <AutoCompleteSearchBar
        onValueChange={(value) => setCredit(value)}
        onInputChange={(query) => updateQuery(query)}
        options={results.map((course) => course.code)}
        style={{ maxWidth: '450px', minWidth: '350px' }}
        autoFocus
      />

      <FormControl className="flex flex-col gap-3">
        <label htmlFor="transfer" className="font-medium text-black">
          Is Transfer Credit?
        </label>

        <RadioGroup
          id="transfer"
          defaultValue={'no'}
          row
          onChange={(_, value) => setIsTransfer(value === 'yes')}
        >
          <FormControlLabel
            className="text-black"
            value="yes"
            control={
              <Radio
                sx={{
                  '&.Mui-checked': {
                    color: '#3E61ED',
                  },
                }}
              />
            }
            label="Yes"
          />
          <FormControlLabel
            className="text-black"
            value="no"
            control={
              <Radio
                sx={{
                  '&.Mui-checked': {
                    color: '#3E61ED',
                  },
                }}
              />
            }
            label="No"
          />
        </RadioGroup>

        <>
          <label htmlFor="semester" className="font-medium text-black">
            Semester
          </label>
          <DropdownSelect
            id="semester"
            value={semester}
            values={semesters as (SemesterCode & { [key: string]: string })[]}
            getValue={(semester) => semester}
            getDisplayedValue={(semester) => displaySemesterCode(semester)}
            onChange={(sem) => setSemester(sem)}
          />
        </>
      </FormControl>
      <Button onClick={submit}>{'Add Credit'}</Button>
    </Layout>
  );
};

export default CreditsForm;