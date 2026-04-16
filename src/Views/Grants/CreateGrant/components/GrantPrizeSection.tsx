import { Calendar, Info, Plus, Trophy } from 'lucide-react';
import type { PrizeWinnerInput } from '../types';

interface GrantPrizeSectionProps {
  prizeAmount: string;
  numberOfPrizes: string;
  applicationDeadline: string;
  prizeWinners: PrizeWinnerInput[];
  onPrizeAmountChange: (value: string) => void;
  onNumberOfPrizesChange: (value: string) => void;
  onApplicationDeadlineChange: (value: string) => void;
  onPrizeWinnerAmountChange: (rank: number, amount: string) => void;
  onSuggestDistribution: () => void;
}

function GrantPrizeSection({
  prizeAmount,
  numberOfPrizes,
  applicationDeadline,
  prizeWinners,
  onPrizeAmountChange,
  onNumberOfPrizesChange,
  onApplicationDeadlineChange,
  onPrizeWinnerAmountChange,
  onSuggestDistribution,
}: GrantPrizeSectionProps) {
  return (
    <section className="form-card">
      <div className="card-header">
        <h3>Prize Details</h3>
        <p>Award amount and deadlines</p>
      </div>
      <div className="card-body">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="prize-amount">
              Prize Amount *
              <div className="input-with-icon">
                <span className="currency-symbol">$</span>
                <input
                  id="prize-amount"
                  type="number"
                  placeholder="5,000"
                  value={prizeAmount}
                  onChange={(event) => onPrizeAmountChange(event.target.value)}
                />
              </div>
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="num-prizes">
              Number of Prizes *
              <div className="input-with-icon">
                <Trophy size={18} />
                <input
                  id="num-prizes"
                  type="number"
                  min="1"
                  max="5"
                  placeholder="e.g., 3"
                  value={numberOfPrizes}
                  onChange={(event) =>
                    onNumberOfPrizesChange(event.target.value)
                  }
                />
              </div>
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="deadline">
              Application Deadline *
              <div className="input-with-icon">
                <Calendar size={18} />
                <input
                  id="deadline"
                  type="datetime-local"
                  value={applicationDeadline}
                  onChange={(event) =>
                    onApplicationDeadlineChange(event.target.value)
                  }
                />
              </div>
            </label>
          </div>
        </div>

        <div className="info-alert">
          <Info size={18} />
          <p>
            Example: 3 prizes means 3 winners will be selected from approved
            candidates
          </p>
        </div>

        <div className="prize-winners-section">
          <div className="section-heading flex-between">
            <div>
              <h4>Prize Winners</h4>
              <p>
                Set amount for first 3 winning ranks. Ranks 4-5 are
                auto-distributed by the backend.
              </p>
            </div>
            {Number(numberOfPrizes) >= 1 && (
              <button
                type="button"
                className="btn-suggest"
                onClick={onSuggestDistribution}
              >
                <Plus size={14} />
                <span>Suggest Distribution</span>
              </button>
            )}
          </div>
          <div className="prize-winners-grid">
            {prizeWinners.length > 0 ? (
              prizeWinners.slice(0, 3).map((winner) => (
                <div key={winner.rank} className="prize-winner-item">
                  <label htmlFor={`prize-winner-${winner.rank}`}>
                    Rank {winner.rank}
                    <div className="input-with-icon">
                      <span className="currency-symbol">$</span>
                      <input
                        id={`prize-winner-${winner.rank}`}
                        type="number"
                        min="0"
                        value={winner.amount}
                        onChange={(event) =>
                          onPrizeWinnerAmountChange(
                            winner.rank,
                            event.target.value
                          )
                        }
                      />
                    </div>
                  </label>
                </div>
              ))
            ) : (
              <div className="empty-prize-winners">
                Add a number of prizes to configure winner rankings.
              </div>
            )}
          </div>
          {Number(numberOfPrizes) > 3 && (
            <div className="auto-distribute-msg">
              <Info size={14} />
              <span>
                The remaining {Number(numberOfPrizes) - 3} prizes (ranks 4-
                {numberOfPrizes}) will be automatically distributed by the
                backend.
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default GrantPrizeSection;
