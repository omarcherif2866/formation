import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const FormationSchema = new Schema(
    {
        titre: {
            type: String,
            // required: true
        },
        description: {
            type: String,
            // required: true
        },
        contenu: [{
            type: String,
            // required: true
        }],
        domaine: { type: Schema.Types.ObjectId, ref: 'Domaines' },
        sessionCours: { type: Schema.Types.ObjectId, ref: 'SessionCours' }

    },
    {
        timestamps: true
    }
);

export default model('Formations', FormationSchema);