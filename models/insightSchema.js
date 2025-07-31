import mongoose from 'mongoose';

const insightSchema = new mongoose.Schema({
  end_year: {
    type: String,
    default: null,
    trim: true
  },
  intensity: {
    type: Number,
    default: null,
    min: 0
  },
  sector: {
    type: String,
    default: null,
    trim: true
  },
  topic: {
    type: String,
    default: null,
    trim: true
  },
  insight: {
    type: String,
    default: null,
    trim: true
  },
  url: {
    type: String,
    default: null,
    trim: true
  },
  region: {
    type: String,
    default: null,
    trim: true
  },
  start_year: {
    type: String,
    default: null,
    trim: true
  },
  impact: {
    type: String,
    default: null,
    trim: true
  },
  added: {
    type: String,
    default: null,
    trim: true
  },
  published: {
    type: String,
    default: null,
    trim: true
  },
  country: {
    type: String,
    default: null,
    trim: true
  },
  relevance: {
    type: Number,
    default: null,
    min: 0
  },
  pestle: {
    type: String,
    default: null,
    trim: true
  },
  source: {
    type: String,
    default: null,
    trim: true
  },
  title: {
    type: String,
    default: null,
    trim: true
  },
  likelihood: {
    type: Number,
    default: null,
    min: 0
  },
  city: {
    type: String,
    default: null,
    trim: true
  }
}, {
  timestamps: true,
  strict: false
});

// Pre-save middleware to clean empty strings
insightSchema.pre('save', function(next) {
  // Convert empty strings to null for better data consistency
  const fields = ['end_year', 'sector', 'topic', 'insight', 'url', 'region', 
                  'start_year', 'impact', 'added', 'published', 'country', 
                  'pestle', 'source', 'title', 'city'];
  
  fields.forEach(field => {
    if (this[field] === '' || this[field] === undefined) {
      this[field] = null;
    }
  });
  
  next();
});

const Insight = mongoose.model('Insights', insightSchema, 'insights');
export default Insight;
