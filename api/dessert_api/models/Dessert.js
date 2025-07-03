const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DessertsSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: undefined
    },
    rating: {
      type: Number,
      default: undefined
    }
  },
  { collection: 'Desserts' }
);

module.exports = mongoose.model('Desserts', DessertsSchema);
