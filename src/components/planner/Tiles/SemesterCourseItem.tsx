import { UniqueIdentifier, useDraggable } from '@dnd-kit/core';
import CloseIcon from '@mui/icons-material/Close';
import { ComponentPropsWithoutRef, FC, forwardRef } from 'react';

import { getStartingPlanSemester, isEarlierSemester } from '@/utils/plannerUtils';

import { DragDataFromSemesterTile, DraggableCourse, Semester } from '../types';

export interface SemesterCourseItemProps extends ComponentPropsWithoutRef<'div'> {
  course: DraggableCourse;
  isValid?: boolean;
  isDisabled: boolean;
  onRemove?: (course: DraggableCourse) => void;
}

/** UI implementation of a semester course */
export const SemesterCourseItem = forwardRef<HTMLDivElement, SemesterCourseItemProps>(
  function SemesterCourseItem({ course, isValid, isDisabled, onRemove, ...props }, ref) {
    return (
      <div
        ref={ref}
        {...props}
        className={`flex h-[22px] w-full items-center justify-between rounded-md py-[1px] px-[8px] shadow-md ${
          isDisabled && 'opacity-60'
        } ${isValid ? 'border-[1px] border-red-500' : ''}`}
      >
        <span className="text-[12px] font-medium text-[#1C2A6D]">{course.code}</span>
        {!isDisabled && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onRemove && onRemove(course);
            }}
          >
            <CloseIcon fontSize="small" />
          </div>
        )}
      </div>
    );
  },
);

export interface DraggableSemesterCourseItemProps {
  dragId: UniqueIdentifier;
  semester: Semester;
  course: DraggableCourse;
  isValid: boolean;
  onRemove: (course: DraggableCourse) => void;
}

/** Compositional wrapper around SemesterCourseItem */
const DraggableSemesterCourseItem: FC<DraggableSemesterCourseItemProps> = ({
  dragId,
  semester,
  course,
  onRemove,
}) => {
  const isDisabled = isEarlierSemester(semester.code, getStartingPlanSemester());
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: dragId,
    data: { from: 'semester-tile', semester, course } as DragDataFromSemesterTile,
    disabled: isDisabled,
  });

  return (
    <SemesterCourseItem
      ref={setNodeRef}
      style={{
        visibility: isDragging ? 'hidden' : 'unset',
      }}
      isDisabled={isDisabled}
      {...attributes}
      {...listeners}
      course={course}
      onRemove={onRemove}
    />
  );
};

export default DraggableSemesterCourseItem;