import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    image: {
      type: String,
      required: true,
    }, 
    statusUser: {
      type: String,
    },
    statusCompte: {
      type: String,
    },
    password: {
      type: String,
      required: true
    },
    roles: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
  },
  {
    timestamps: true
  }
);
export default model('Users', userSchema); 
