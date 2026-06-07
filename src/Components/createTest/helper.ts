interface ICreateTestForm {
  name: string;
  type: string;
  subject: string;
  topics: string[];
  sub_topics: string[];
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  difficulty: string;
  total_time: number;
  total_marks: number;
  total_questions: number;
  status: string | null;
  map_all_topics: boolean;
  map_all_sub_topics: boolean;
}

export interface ISubject {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ITopic {
  id: string;
  subject_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ISTopic {
  id: string;
  topic_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export const initialValues: ICreateTestForm = {
  name: "",
  type: "",
  subject: "",
  topics: [],
  sub_topics: [],
  correct_marks: 0,
  wrong_marks: 0,
  unattempt_marks: 0,
  difficulty: "",
  total_time: 0,
  total_marks: 0,
  total_questions: 0,
  status: null,
  map_all_topics: false,
  map_all_sub_topics: false,
};
