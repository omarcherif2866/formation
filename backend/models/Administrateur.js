import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const AdminSchema = new Schema(
    {
        profil: { type: Schema.Types.ObjectId, ref: 'Profil', required: true }


    },
    {
        timestamps: true
    }
);

export default model('Admins', AdminSchema);