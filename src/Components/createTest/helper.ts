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

export interface ITestDetails {
  id: string;
  name: string;
  type: string;
  subject: string;
  topics: string[];
  sub_topics: string[];
  questions: string[] | null;
  correct_marks: number;
  unattempt_marks: number;
  wrong_marks: number;
  difficulty: string;
  total_marks: number;
  total_time: number;
  total_questions: number;
  slot: string | null;
  hidden_from_moderator: boolean | null;
  created_by: number;
  created_at: string;
  updated_by: number | null;
  updated_at: string | null;
  paragraph_question: string | null;
  status: string;
  scheduled_date: string | null;
  expiry_date: string | null;
  original_files: string[];
}

export interface IQuestionForm {
  type: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: string;
  explanation: string;
  difficulty: string;
  media_url: string;
  test_id: string;
}

export const questionInitialValues: IQuestionForm = {
  type: "mcq",
  question: "",
  option1: "",
  option2: "",
  option3: "",
  option4: "",
  correct_option: "",
  explanation: "",
  difficulty: "easy",
  media_url: "",
  test_id: "",
};

export const initialValues: ICreateTestForm = {
  name: "",
  type: "chapterwise",
  subject: "",
  topics: [],
  sub_topics: [],
  correct_marks: 0,
  wrong_marks: 0,
  unattempt_marks: 0,
  difficulty: "easy",
  total_time: 0,
  total_marks: 0,
  total_questions: 0,
  status: "draft",
  map_all_topics: false,
  map_all_sub_topics: false,
};
