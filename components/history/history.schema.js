const { Schema, model } = require("mongoose");
const { mlsSchema } = require("../mls/mls.schema");

const searchHistorySchema = new Schema({
  searchTerm: {
    type: String,
    required: [true, "please insert search term"],
  },
  searchResults: {
    type: [mlsSchema],
    required: [true, "please insert search results"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const SearchHistory = new model("SearchHistory", searchHistorySchema);

module.exports = SearchHistory;
