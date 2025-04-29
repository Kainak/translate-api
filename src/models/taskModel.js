import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  description: { type: String, unique: true, required: true, },
  done: { type: Boolean, required: true, },
}, {
  versionKey: false,
  timestamps: true,
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
