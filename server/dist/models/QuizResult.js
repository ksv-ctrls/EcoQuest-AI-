import mongoose, { Schema } from 'mongoose';
const quizResultSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    quizId: { type: String, required: true, trim: true },
    score: { type: Number, required: true, min: 0 },
    accuracy: { type: Number, required: true, min: 0, max: 100 },
    timeTaken: { type: Number, required: true, min: 0 },
}, { timestamps: true });
quizResultSchema.index({ userId: 1, quizId: 1, createdAt: -1 });
export const QuizResultModel = mongoose.model('QuizResult', quizResultSchema);
