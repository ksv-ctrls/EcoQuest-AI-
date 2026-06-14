import mongoose, { Schema } from 'mongoose';
const gameProgressSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    gameId: { type: String, required: true, trim: true },
    score: { type: Number, default: 0, min: 0 },
    completed: { type: Boolean, default: false },
    completionTime: { type: Number, default: 0, min: 0 },
    isUnlocked: { type: Boolean, default: true },
    isCompleted: { type: Boolean, default: false },
    bestScore: { type: Number, default: 0 },
    lastPlayedAt: { type: Date },
    progressValue: { type: Number, default: 0 },
    timesPlayed: { type: Number, default: 0 },
    completionCount: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
}, { timestamps: true });
gameProgressSchema.index({ userId: 1, gameId: 1 }, { unique: true });
export const GameProgressModel = mongoose.model('GameProgress', gameProgressSchema);
