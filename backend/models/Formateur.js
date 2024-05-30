import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const STATUS_VALUES = ['En attente', 'Accepté', 'Rejeté'];

const FormateurSchema = new Schema(
    {
        status: {
            type: String,
            enum: STATUS_VALUES,
            // required: true,
            default: 'En attente'
        },
        fichiers: [{
            type: String,
            
        }],
        profil: { type: Schema.Types.ObjectId, ref: 'Profil', required: true }

    },
    {
        timestamps: true
    }
);

export default model('Formateurs', FormateurSchema);