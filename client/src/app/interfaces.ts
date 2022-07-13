export interface Question {
  _id?: string;
  title: string;
  optionType: OptionType;
  options: Option[];
  chosenOptions?: string[];
}

export interface Option {
  _id?: string;
  details: string;
  count?: number;
}

export enum OptionType {
  CHECKBOX = 'checkbox',
  RADIO = 'radio'
}
