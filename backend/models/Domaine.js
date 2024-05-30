import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const DomaineSchema = new Schema(
    {
        type: {
            type: String,
            required: true
        },
        cours: [{ type: Schema.Types.ObjectId, ref: 'Formations' }]
    },
    {
        timestamps: true
    }
);

export default model('Domaines', DomaineSchema);