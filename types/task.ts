import moment from "moment";

export type Task = {
  id: number;
  title: string;
  description: string;
  dueDate: moment.Moment | undefined;
  done: boolean;
  tags: string[];
  categoryId: number;
}

export type TaskForJson = Omit<Task, 'dueDate'> & {
  dueDate: number | undefined;
}

export type TaskCreateData = Omit<Task, 'id'>;
