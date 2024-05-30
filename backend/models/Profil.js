import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const STATUS_ORDER_VALUES = ['apprenant', 'formateur', 'admin'];

const ProfilSchema = new Schema(
    {
        nom: {
            type: String,
            required: true
        },
        adresse: {
            type: String,
            required: true
        },
        motdepasse: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true,
          },
        role: {
            type: String,
            enum: STATUS_ORDER_VALUES,
            // required: true
        },
        resetPasswordToken: {
            type: String,
            default: ''
          },
          resetPasswordExpires: {
            type: Date,
            default: Date.now
          }
    },
    {
        timestamps: true
    }
);

export default model('Profil', ProfilSchema);
