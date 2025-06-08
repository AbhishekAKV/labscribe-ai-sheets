
export interface Section {
  id: string;
  name: string;
  content: string;
  images: string[];
}

export interface FormData {
  subject: string;
  experiment: string;
  apiKey: string;
  model: string;
  customPrompt: string;
}
