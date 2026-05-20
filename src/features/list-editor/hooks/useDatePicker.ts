import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

import { FuzzyDate } from "@/shared/lib/graphql/generated/graphql";

interface UseDatePickerProps {
   onStartDateChange: (date: FuzzyDate) => void;
   onFinishDateChange: (date: FuzzyDate) => void;
}

export const useDatePicker = ({ onStartDateChange, onFinishDateChange }: UseDatePickerProps) => {
   const openStartDatePicker = (currentValue?: FuzzyDate | null) => {
      const initialDate = currentValue?.year
         ? new Date(currentValue.year, currentValue.month! - 1, currentValue.day!)
         : new Date();

      DateTimePickerAndroid.open({
         value: initialDate,
         mode: "date",
         onChange(_event, date) {
            if (date) {
               onStartDateChange({
                  day: date.getDate(),
                  month: date.getMonth() + 1,
                  year: date.getFullYear(),
               });
            }
         },
      });
   };

   const openFinishDatePicker = (currentValue?: FuzzyDate | null) => {
      const initialDate = currentValue?.year
         ? new Date(currentValue.year, currentValue.month! - 1, currentValue.day!)
         : new Date();

      DateTimePickerAndroid.open({
         value: initialDate,
         mode: "date",
         onChange(_event, date) {
            if (date) {
               onFinishDateChange({
                  day: date.getDate(),
                  month: date.getMonth() + 1,
                  year: date.getFullYear(),
               });
            }
         },
      });
   };

   return { openStartDatePicker, openFinishDatePicker };
};
