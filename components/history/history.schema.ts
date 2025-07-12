import { Schema, model, Document, Model } from 'mongoose';
import { mlsSchema } from '../mls/mls.schema';

// Interface for SearchHistory document
export interface ISearchHistory extends Document {
  searchTerm: string;
  searchResults: any[]; // Using any[] for now since mlsSchema type is not defined
  date: Date;
}

// Interface for SearchHistory model
export interface ISearchHistoryModel extends Model<ISearchHistory> {}

const searchHistorySchema = new Schema<ISearchHistory>({
  searchTerm: {
    type: String,
    required: [true, 'please insert search term'],
  },
  searchResults: {
    type: [mlsSchema],
    required: [true, 'please insert search results'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const SearchHistory = model<ISearchHistory, ISearchHistoryModel>('SearchHistory', searchHistorySchema);

export default SearchHistory; 