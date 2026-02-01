const mongoose = require("mongoose");

const SubSectionSchema = new mongoose.Schema({
  title: { type: String },
  timeDuration: { type: String },
  description: { type: String },
  videoUrl: { type: String },
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
    },
  ],
});

module.exports = mongoose.model("SubSection", SubSectionSchema);
