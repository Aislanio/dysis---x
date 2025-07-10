import mongoose from 'mongoose';

const MensagemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  msg: { type: String, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  comments: { type: [
    {
      name: { type: String },
      msg: { type: String }
    }
  ], default: [] },
  ipReactionsTrue: { type: [String], default: [] },
  ipReactionsFalse: { type: [String], default: [] }
},{ timestamps: true });

export default mongoose.model('Mensagem', MensagemSchema);
