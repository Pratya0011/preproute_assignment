export interface ITest {
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
  hidden_from_moderator: string | null;
  created_by: number;
  created_at: string;
  updated_by: number | null;
  updated_at: string | null;
  paragraph_question: string | null;
  status: "draft" | "live" | "scheduled" | "expired";
  scheduled_date: string | null;
  expiry_date: string | null;
}
