const { Schema, model } = require("mongoose");
const { mlsSchema } = require("../mls/mls.schema"); // Assuming this is your MLS schema

const searchHistorySchema = new Schema({
  searchTerm: {
    type: String,
    required: [true, "Please insert a search term"],
  },
  searchResults: {
    type: [mlsSchema], // Array of MLS listings
    required: [true, "Please insert search results"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  query: {
    type: String,
    required: true,
  },
  filters: {
    priceRange: {
      min: { type: Number, required: false },
      max: { type: Number, required: false },
    },
    bedrooms: {
      min: { type: Number, required: false },
      max: { type: Number, required: false },
    },
    bathrooms: {
      min: { type: Number, required: false },
      max: { type: Number, required: false },
    },
    squareFeet: {
      min: { type: Number, required: false },
      max: { type: Number, required: false },
    },
    propertyType: {
      type: String,
      enum: ["Single Family", "Multi Family", "Condo", "Townhouse", "Land"],
      required: false,
    },
    location: {
      city: { type: String, required: false },
      state: { type: String, required: false },
      zipCode: { type: String, required: false },
    },
    mlsId: {
      type: String,
      required: false, // Allow searching by MLS ID
      minLength: 2,
      maxLength: 12,
    },
  },
  searchedAt: {
    type: Date,
    default: Date.now,
  },
});

// Model creation
const SearchHistory = model("SearchHistory", searchHistorySchema);

module.exports = { SearchHistory };
