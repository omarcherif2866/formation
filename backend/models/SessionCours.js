import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const SessionCoursSchema = new Schema(
  {
    nomSession: {
      type: String,
      required: true
  },
  date: {
      type: String,
      required: true
  },
    apprenants: [{ type: Schema.Types.ObjectId, ref: 'Apprenants' }],
    formations: [{ type: Schema.Types.ObjectId, ref: 'Formations' }]


  },
  {
    timestamps: true
  }
);

export default model('SessionCours', SessionCoursSchema);
