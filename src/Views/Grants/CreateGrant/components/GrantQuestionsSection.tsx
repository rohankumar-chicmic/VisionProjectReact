import { Plus, Trash2 } from 'lucide-react';
import type { Question } from '../types';

interface GrantQuestionsSectionProps {
  questions: Question[];
  onAddQuestion: () => void;
  onRemoveQuestion: (questionId: number) => void;
  onQuestionTextChange: (questionId: number, value: string) => void;
  onQuestionTypeChange: (
    questionId: number,
    value: 'LongText' | 'Number' | 'File' | 'ShortText'
  ) => void;
}

function GrantQuestionsSection({
  questions,
  onAddQuestion,
  onRemoveQuestion,
  onQuestionTextChange,
  onQuestionTypeChange,
}: GrantQuestionsSectionProps) {
  return (
    <section className="form-card">
      <div className="card-header flex-header">
        <div className="header-text">
          <h3>Application Questions</h3>
          <p>Custom questions shown to users when applying to this grant</p>
        </div>
        <button
          type="button"
          className="btn-add-item btn-primary-lite"
          onClick={onAddQuestion}
        >
          <Plus size={16} />
          <span>Add Question</span>
        </button>
      </div>
      <div className="card-body">
        <div className="questions-list">
          {questions.map((question) => (
            <div key={question.id} className="question-item">
              <div className="number-circle">{question.id}</div>
              <label
                htmlFor={`question-text-${question.id}`}
                className="sr-only"
              >
                Question Text
                <input
                  id={`question-text-${question.id}`}
                  className="question-input"
                  value={question.questionText}
                  onChange={(event) =>
                    onQuestionTextChange(question.id, event.target.value)
                  }
                />
              </label>
              <div className="question-actions">
                <label
                  htmlFor={`question-type-${question.id}`}
                  className="sr-only"
                >
                  Question Type
                  <select
                    id={`question-type-${question.id}`}
                    className="type-select"
                    value={question.questionType}
                    onChange={(event) =>
                      onQuestionTypeChange(
                        question.id,
                        event.target.value as
                          | 'LongText'
                          | 'Number'
                          | 'File'
                          | 'ShortText'
                      )
                    }
                  >
                    <option value="ShortText">Short Text</option>
                    <option value="LongText">Long Text</option>
                    <option value="Number">Number</option>
                    <option value="File">File Upload</option>
                  </select>
                </label>
                <button
                  type="button"
                  className="icon-btn delete"
                  onClick={() => onRemoveQuestion(question.id)}
                  aria-label="Delete question"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GrantQuestionsSection;
