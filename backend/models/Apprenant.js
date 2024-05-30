import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const ApprenantSchema = new Schema(
    {
        listCoursInscrits:[{ type: Schema.Types.ObjectId, ref: 'Formations' }],

        profil: { type: Schema.Types.ObjectId, ref: 'Profil', required: true }


    },
    {
        timestamps: true
    }
);

export default model('Apprenants', ApprenantSchema);